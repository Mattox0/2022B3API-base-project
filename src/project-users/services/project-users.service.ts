import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { ProjectUser } from "../project-users.entity";
import { User } from "../../users/users.entity";
import { CreatedProjectUserDto } from "../dto/project-users.dto";
import * as dayjs from 'dayjs';



@Injectable()
export class ProjectUserService {
    constructor(
        @InjectRepository(ProjectUser)
        private projectUsersRepository: Repository<ProjectUser>,
    ) {}

    async GetAllUserProjects() {
        return await this.projectUsersRepository.find();
    }

    async GetUserProjects(user: User): Promise<ProjectUser[]> {
        return await this.projectUsersRepository.find({ where: {userId: user.id} });
    }

    async GetOneProjectUser(id: string): Promise<ProjectUser> {
        return await this.projectUsersRepository.findOne({ where: {id: id} });
    }

    async CheckDate(user: User, startDate: Date, endDate: Date) {
        const projectUsers = await this.projectUsersRepository.find({ where: {userId: user.id} }); // regarder si date dans requete
        let isOnProject = false;
        projectUsers.forEach(userProject => {
            if (dayjs(startDate).isBetween(dayjs(userProject.startDate), dayjs(userProject.endDate), 'minute', '[]') || dayjs(endDate).isBetween(dayjs(userProject.startDate), dayjs(userProject.endDate), 'minute', '[]')) {
                isOnProject = true;
            }
        });
        return isOnProject;
    }

    async CheckOneDate(date: Date, userId: string) {
        const projectUsers = await this.projectUsersRepository.find({ where: {userId: userId} });
        let project = null;
        projectUsers.forEach(userProject => {
            if (dayjs(date).isBetween(dayjs(userProject.startDate), dayjs(userProject.endDate), 'day', '[]')) {
                project = userProject;
            }
        });
        return project;
    }

    Create(projectUser: CreatedProjectUserDto): Promise<ProjectUser> {
        const newProjectUser = this.projectUsersRepository.create(projectUser);
        return this.projectUsersRepository.save(newProjectUser);
    }
}