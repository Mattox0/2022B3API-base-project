import { IsNotEmpty, IsUUID, MinLength } from "class-validator"

export class CreatedProjectsDto {
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsUUID(4)
    referringEmployeeId: string;
}