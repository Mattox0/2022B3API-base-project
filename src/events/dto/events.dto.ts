import { IsNotEmpty } from "class-validator"

export class CreatedEventDto {
    @IsNotEmpty()
    date: Date

    eventDescription: string

    @IsNotEmpty()
    eventType: 'RemoteWork' | 'PaidLeave'
}