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

async function returnRouteResponse(routeRequest: RouteRequest): Promise<any> {
    const routing = new RoutesClient();
    const departure = new Date();
    const departureTimestamp = {
        seconds: Math.floor(departure.getTime() / 1000),
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

    const res = await routing.computeRoutes(
        {
            origin: routeRequest.origin,
            destination: routeRequest.destination,
            travelMode: routeRequest.travelMode || 'TRANSIT',
            departureTime: departureTimestamp,
            computeAlternativeRoutes: true,
            transitPreferences: {
                allowedTravelModes: filteredModes as any,
                routingPreference: routingPreference as any
            }
        },
        {
            // Required: field mask header; include your API key here
            otherArgs: {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
                    // ask only for what you need to reduce latency/size:
                    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.transitDetails,routes.legs.transitLine,routes.legs.transitStops,routes.legs.transitAgencies,routes.legs.transitFare',
                },
            },
        }
    );
}

export default {
    returnRouteResponse
};