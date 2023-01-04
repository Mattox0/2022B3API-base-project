import { IsNotEmpty, IsUUID } from "class-validator"

export class CreatedProjectUserDto {
    @IsNotEmpty()
    startDate: Date;

    @IsNotEmpty()
    endDate: Date;

    @IsNotEmpty()
    @IsUUID(4)
    projectId: string;

    @IsNotEmpty()
    @IsUUID(4)
    userId: string;
}