import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Events } from "../events/event.entity";
import { ProjectUser } from "../project-users/project-users.entity";
import { Project } from "../projects/projects.entity";
import { Role } from "./role.enum";

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

    @Column({ type: "varchar", default: Role.Employee, nullable: false})
    role: Role;

    @OneToMany(() => Project, project => project.referringEmployee)
    projects: Project[];

    @OneToMany(() => ProjectUser, projectUser => projectUser.user)
    projectUsers: ProjectUser[];

    @OneToMany(() => Events, projectUser => projectUser.user)
    events: Events[];
}   