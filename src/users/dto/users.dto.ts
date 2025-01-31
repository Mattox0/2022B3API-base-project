import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Role } from "../role.enum";

export class CreatedUsersDto {
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    role?: Role;
}