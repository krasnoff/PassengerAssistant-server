export interface RouteRequest {
  origin: Origin
  destination: Destination
  travelMode: string
  departureTime: string
  computeAlternativeRoutes: boolean
  transitPreferences: TransitPreferences
}

export interface Origin {
  address?: string
  coordinates?: Coordinates
}

export interface Destination {
  address?: string
  coordinates?: Coordinates
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface TransitPreferences {
  routingPreference: string
  allowedTravelModes: string[]
}