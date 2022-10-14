import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", unique: true, nullable: false})
    username: string;

    @Column({ type: "varchar", unique: true, nullable: false})
    email: string;

    @Column( { type: "varchar", nullable: false})
    password: string;

    @Column({ type: "varchar", default: 'Employee', nullable: false})
    role: "Employee" | "Admin" | "ProjectManager";
}   