import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

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

    role?: "Employee" | "Admin" | "ProjectManager";
}