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
    // Build protobuf Timestamp for departureTime (client serializer expects object)
    const departureDate = routeRequest.departureTime ? new Date(routeRequest.departureTime) : new Date();
    const departureTimestamp = {
        seconds: String(Math.floor(departureDate.getTime() / 1000)),
        nanos: (departureDate.getMilliseconds() % 1000) * 1000000,
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
        // Waypoint accepts address/placeId/location; we use address strings
        origin: routeRequest.origin,
        destination: routeRequest.destination,
        travelMode: routeRequest.travelMode || 'TRANSIT',
        languageCode: 'he-IL',
        // For client lib, provide Timestamp object
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
    });
    return res;
}
exports.default = {
    returnRouteResponse
};
