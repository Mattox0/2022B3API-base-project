import { IsNotEmpty, IsUUID } from "class-validator"

export class EventDto {
    @IsNotEmpty()
    date: Date

    eventDescription: string

    @IsNotEmpty()
    eventType: 'RemoteWork' | 'PaidLeave'

    eventStatus: string

    @IsNotEmpty()
    @IsUUID(4)
    userId: string
}