import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../projects/projects.entity";
import { User } from "../users/users.entity";

@Entity()
export class ProjectUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false})
    startDate: Date;

    @Column({ nullable: false})
    endDate: Date;

    @Column({ type:"uuid", nullable: false})
    projectId: string;

    @Column({ type:"uuid", nullable: false})
    userId: string;

    @ManyToOne(() => User, user => user.projectUsers)
    user: User;

    @OneToMany(() => Project, project => project.projectUser)
    projects: Project[];
}