import 'dotenv/config';
import { returnRouteResponse } from '../services/route.service';

async function main() {
  const from = process.env.ROUTE_SMOKE_FROM || 'Tel Aviv-Yafo, Israel';
  const to = process.env.ROUTE_SMOKE_TO || 'Ben Gurion Airport, Israel';

  console.log('Running route smoke test...');
  console.log('From:', from);
  console.log('To  :', to);

  try {
    const res = await returnRouteResponse({
      origin: { address: from },
      destination: { address: to },
      travelMode: 'TRANSIT',
      computeAlternativeRoutes: true,
      transitPreferences: {
        allowedTravelModes: ['BUS', 'RAIL', 'SUBWAY', 'TRAM', 'FERRY'],
        routingPreference: 'FEWER_TRANSFERS'
      }
    });

    console.log('OK. Route response summary:\n', JSON.stringify({
      routesCount: (res.routes || []).length,
      firstRoute: res.routes?.[0] ? {
        duration: res.routes[0].duration,
        distanceMeters: res.routes[0].distanceMeters,
        hasPolyline: !!res.routes[0].polyline?.encodedPolyline,
        fare: res.routes[0].travelAdvisory?.transitFare
      } : null
    }, null, 2));
  } catch (err: any) {
    console.error('Smoke test failed:', err?.message || err);
    if (err?.details) console.error('Details:', err.details);
    if (err?.code) console.error('Code:', err.code);
    process.exitCode = 1;
  }
}

main();
