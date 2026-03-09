export type Place = {
    id: string
    name: string
    address: string
    lat?: number
    lng?: number
}

export type RecentRoute = {
    id: string
    start: string
    end: string
}

export type FavoritePlace = {
    id: string
    label: string
    name: string
    address: string
    lat?: number
    lng?: number
}