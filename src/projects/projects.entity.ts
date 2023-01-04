import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectUser } from "../project-users/project-users.entity";
import { User } from "../users/users.entity";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", nullable: false})
    name: string;

    @Column({ type: "uuid", nullable: false})
    referringEmployeeId: string;

    @ManyToOne(() => User, user => user.projects)
    referringEmployee: User;

    @ManyToOne(() => ProjectUser, projectUser => projectUser.projects)
    projectUser: ProjectUser;
}