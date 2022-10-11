import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", unique: true, nullable: false})
    @IsNotEmpty()
    username: string;

    @Column({ type: "varchar", unique: true, nullable: false})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column( { type: "varchar", unique: true, nullable: false})
    @IsNotEmpty()
    password: string;

    @Column({ type: "varchar", default: 'Employee', nullable: false})
    role: string;
}