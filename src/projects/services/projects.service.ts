import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { Project }  from './../projects.entity';
import { Repository } from "typeorm";
import { CreatedProjectsDto } from "../dto/projects.dto";
import { User } from "../../users/users.entity";
import { ProjectUser } from "../../project-users/project-users.entity";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) {}

    GetAllProjects(): Promise<Project[]> {
        return this.projectsRepository.find();
    }

    GetAllMySelf(): Promise<Project[]> {
        return this.projectsRepository.find();
    }

    GetOneUserProjects(id: string): Promise<Project[]> {
        return this.projectsRepository.find({ where: {referringEmployeeId: id} });
    }

    Create(project: CreatedProjectsDto): Promise<Project> {
        const newProject = this.projectsRepository.create(project);
        return this.projectsRepository.save(newProject);
    }

    FindOneProject(id: string): Promise<Project> {
        return this.projectsRepository.findOne({ where: {id: id} });
    }

    FindProjectForCSV(id: string): Promise<Project> {
        return this.projectsRepository.findOne({ where: {referringEmployeeId: id} });
    }

    async CheckManager(projectId: string, userId: string): Promise<Project> {
        return await this.projectsRepository.findOne({ where: {id: projectId, referringEmployeeId: userId} });
    }
}