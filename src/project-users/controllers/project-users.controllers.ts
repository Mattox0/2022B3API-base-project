import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Body, Controller, Post, Get, ValidationPipe, UsePipes, Param, HttpStatus } from '@nestjs/common';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { ProjectUserService } from "../services/project-users.service";
import { UsersService } from "../../users/services/users.service";
import { ProjectsService } from "../../projects/services/projects.service";
import { HttpException, UnauthorizedException, ConflictException } from '@nestjs/common/exceptions';
import { CreatedProjectUserDto } from "../dto/project-users.dto";

@Controller('project-users')
@UseGuards(JwtAuthGuard)
export class ProjectUserController {
    constructor(private projectUserService: ProjectUserService, private userService: UsersService, private projectService: ProjectsService) {}

    @UsePipes(ValidationPipe)
    @Post('/')
    async CreateUserProject(@Req() req, @Body() body: CreatedProjectUserDto) {
        let me = await this.userService.FindOneUser(req.user.username);
        if (me.role === 'Employee') {
            throw new UnauthorizedException();
        }
        let project = await this.projectService.FindOneProject(body.projectId);
        let user = await this.userService.FindOneId(body.userId);
        if (!project || !user) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        let check = await this.projectUserService.CheckDate(user, body.startDate, body.endDate);
        if (check) {
            throw new ConflictException();
        }
        return this.projectUserService.Create(body);
    }

    @Get()
    async GetAllUserProjects(@Req() req) {
        let me = await this.userService.FindOneUser(req.user.username);
        if (me.role === 'Employee') {
            return this.projectUserService.GetUserProjects(me);
        }
        return this.projectUserService.GetAllUserProjects();
    }

    @Get(':id')
    async GetOneProject(@Req() req, @Param('id') id: string) {
        let me = await this.userService.FindOneUser(req.user.username);
        let projectUser = await this.projectUserService.GetOneProjectUser(id);
        if (!projectUser) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        if (me.role !== "Employee" || projectUser.userId === id) {
            return projectUser;
        } else {
            throw new UnauthorizedException();
        }
    }
}