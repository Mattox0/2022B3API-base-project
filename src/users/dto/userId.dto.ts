import { IsNotEmpty, IsUUID } from "class-validator"

export class UserId {
    @IsNotEmpty()
    @IsUUID(4)
    id: string;
}