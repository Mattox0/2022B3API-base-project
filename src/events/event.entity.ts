import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.entity";

@Entity()
export class Events {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false})
    date: Date;

    @Column({ nullable: true, default: 'Pending'})
    eventStatus: string;

    @Column({ nullable: false})
    eventType: 'RemoteWork' | 'PaidLeave';

    @Column({ nullable: true})
    eventDescription: string;

    @Column({ type:"uuid", nullable: false})
    userId: string;

    @ManyToOne(() => User, user => user.events)
    user: User;
}