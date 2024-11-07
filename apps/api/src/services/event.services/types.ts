// {name, type, category, location, locationName, url, summary, eventStartDate, eventEndDate, isPaid, capacity}
export interface ICreateEvent {
    name: string,
    type: string,
    category: string,
    location: string,
    locationName: string,
    url: string,
    summary: string,
    eventStartDate: Date,
    eventEndDate: Date
    isPaid: boolean
    capacity: Number
}