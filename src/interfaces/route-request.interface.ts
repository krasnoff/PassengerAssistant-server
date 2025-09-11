export interface RouteRequest {
  origin: Origin
  destination: Destination
  travelMode: string
  departureTime: string
  computeAlternativeRoutes: boolean
  transitPreferences: TransitPreferences
}

export interface Origin {
  address: string
}

export interface Destination {
  address: string
}

export interface TransitPreferences {
  routingPreference: string
  allowedTravelModes: string[]
}