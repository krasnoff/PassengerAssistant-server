"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnRouteResponse = returnRouteResponse;
const routing_1 = require("@googlemaps/routing");
async function returnRouteResponse(routeRequest) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_WEB_API_KEY || '';
    if (!apiKey) {
        throw new Error('Missing Google Maps API key. Set GOOGLE_MAPS_API_KEY in your environment.');
    }
    // Force REST fallback and use API key auth to avoid service-account/ADC issues
    const routing = new routing_1.RoutesClient({
        fallbackRest: true,
        apiKey,
    });
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
    const [res] = await routing.computeRoutes({
        origin: routeRequest.origin,
        destination: routeRequest.destination,
        travelMode: routeRequest.travelMode || 'TRANSIT',
        departureTime: departureTimestamp,
        computeAlternativeRoutes: routeRequest.computeAlternativeRoutes ?? true,
        transitPreferences: {
            allowedTravelModes: filteredModes,
            routingPreference: routingPreference
        }
    }, {
        // Required: field mask header
        otherArgs: {
            headers: {
                'Content-Type': 'application/json',
                // ask only for what you need to reduce latency/size:
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.transitDetails,routes.legs.transitLine,routes.legs.transitStops,routes.legs.transitAgencies,routes.legs.transitFare',
            },
        },
    });
    return res;
}
exports.default = {
    returnRouteResponse
};
