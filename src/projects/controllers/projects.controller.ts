import { Body, Controller, Post, Get, Request, Logger, ValidationPipe, UsePipes, Param, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatedProjectsDto } from '../dto/projects.dto';
import { ProjectsService } from '../services/projects.service';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { UsersService } from '../../users/services/users.service';
import { ForbiddenException, HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ProjectUserService } from '../../project-users/services/project-users.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private userService: UsersService,
    private projectsUsersService: ProjectUserService,
    ) {} // 

  @UsePipes(ValidationPipe)
  @Post('/')
  async CreateProject(@Req() req, @Body() body: CreatedProjectsDto) {
    let me = await this.userService.FindOneUser(req.user.username);
    let referringUser = await this.userService.FindOneId(body.referringEmployeeId);
    if (referringUser.role === "Employee" || me.role !== 'Admin') {
      throw new UnauthorizedException();
    }
    return this.projectsService.Create(body);
  }

  @Get('/')
  async GetAll(@Req() req) {
    let me = await this.userService.FindOneUser(req.user.username);
    if (me.role === "Employee") {
      let myProjects = await this.projectsUsersService.GetUserProjects(me);
      const promise = myProjects.map(async (project) => {
        return await this.projectsService.FindOneProject(project.projectId);
      });
      return await Promise.all(promise);
    }
    return this.projectsService.GetAllProjects();
  }

  @Get(':id')
  async GetOne(@Req() req, @Param('id') id: string) {
    if (!id) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    let me = await this.userService.FindOneUser(req.user.username);
    let project = await this.projectsService.FindOneProject(id);
    if (!project) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    let myProjects = await this.projectsUsersService.GetUserProjects(me);
    if (me.role !== 'Employee' || myProjects.find(project => project.projectId === id)) {
      return project;
    } else {
      throw new ForbiddenException();
    }
  }
}