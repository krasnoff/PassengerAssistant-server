import { RoutesClient } from "@googlemaps/routing";
import { Destination, Origin, TransitPreferences } from "../interfaces/route-request.interface";

export interface RouteRequest {
    origin: Origin
    destination: Destination
    travelMode?: "TRANSIT" | "TRAVEL_MODE_UNSPECIFIED" | "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER" | null | undefined
    departureTime?: string
    computeAlternativeRoutes?: boolean
    transitPreferences?: TransitPreferences
}

export async function returnRouteResponse(routeRequest: RouteRequest): Promise<any> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_WEB_API_KEY || '';
    if (!apiKey) {
        throw new Error('Missing Google Maps API key. Set GOOGLE_MAPS_API_KEY in your environment.');
    }

    // Force REST fallback and use API key auth to avoid service-account/ADC issues
    const routing = new RoutesClient({
        fallbackRest: true,
        apiKey,
    } as any);
    // Build protobuf Timestamp for departureTime (client serializer expects object)
    const departureDate = routeRequest.departureTime ? new Date(routeRequest.departureTime) : new Date();
    const departureTimestamp = {
        seconds: String(Math.floor(departureDate.getTime() / 1000)),
        nanos: (departureDate.getMilliseconds() % 1000) * 1_000_000,
    };
    
    // Only allow valid travel modes and routing preferences
    const validModes = ['BUS', 'RAIL', 'SUBWAY', 'TRAM', 'FERRY'];
    const validRoutingPreferences = ['FEWER_TRANSFERS', 'LESS_WALKING', 'TRANSIT_ROUTING_PREFERENCE_UNSPECIFIED'];

    const transitPrefs = routeRequest.transitPreferences || {
        allowedTravelModes: validModes,
        routingPreference: 'FEWER_TRANSFERS'
    };

    const filteredModes = (transitPrefs.allowedTravelModes || []).filter(mode => validModes.includes(mode));
    const routingPreference = validRoutingPreferences.includes(transitPrefs.routingPreference)
        ? transitPrefs.routingPreference
        : 'FEWER_TRANSFERS';

    const [res] = await routing.computeRoutes(
        {
            // Waypoint accepts address/placeId/location; we use address strings
            origin: routeRequest.origin as any,
            destination: routeRequest.destination as any,
            travelMode: routeRequest.travelMode || 'TRANSIT',
            // For client lib, provide Timestamp object
            departureTime: departureTimestamp as any,
            computeAlternativeRoutes: routeRequest.computeAlternativeRoutes ?? true,
            transitPreferences: {
                allowedTravelModes: filteredModes as any,
                routingPreference: routingPreference as any
            }
        },
        {
            // Required: field mask header
            otherArgs: {
                headers: {
                    'Content-Type': 'application/json',
                    // Ask only for what you need to reduce latency/size with valid field paths
                    // For transit, details are on legs.steps.transitDetails; transit fares live under travelAdvisory
                    'X-Goog-FieldMask': [
                        'routes.duration',
                        'routes.distanceMeters',
                        'routes.polyline.encodedPolyline',
                        'routes.legs.steps.transitDetails',
                        'routes.travelAdvisory.transitFare'
                    ].join(','),
                },
            },
        }
    );

    return res;
}

export default {
    returnRouteResponse
};