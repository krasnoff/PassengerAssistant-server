export interface ActionResponse {
    messages: Message[],
    args: ActionResponseArgs;
}

export interface ActionResponseArgs {
    startingPoint: any;
    coordinates?: Coordinates
    currentTime?: string
}

export interface Coordinates {
    latLng: LatLng;
}

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface Message {
    role: "user" | "assistant" | "tool"
    name?: string
    content: string | object
}