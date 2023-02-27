// export type TFilterKeys = 'teams' | 'date' | 'status' | 'league' | 'conference' | 'division' | 'skip' | 'limit'
//general utility types
export type TSchemaPartial<T> = Partial<{ [key in keyof T]: any }>
//commonn types required everywhere
export type TGameFilter = {
    teams: string[]
    date: string
    status: 'scheduled' | 'in progress' | 'final' | 'canceled' | 'delayed'
    league: string
    conference: string
    division: string[]
    skip: number
    limit: number
}