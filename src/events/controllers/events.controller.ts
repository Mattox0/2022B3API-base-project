import { Body, Controller, UseGuards, Get, Post } from "@nestjs/common";
import { Param, Req } from '@nestjs/common/decorators';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UsersService } from "../../users/services/users.service";
import { EventDto } from "../dto/event.dto";
import { CreatedEventDto } from "../dto/events.dto";
import { EventService } from "../services/events.service";
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { HttpStatus } from "@nestjs/common/enums";
import { ProjectUserService } from "../../project-users/services/project-users.service";
import { ProjectsService } from "../../projects/services/projects.service";
import { appendFileSync } from "fs";



@Controller('events')
// @UseGuards(JwtAuthGuard)
export class EventsController {
    constructor(private eventService: EventService, private userService: UsersService, private projectUserService: ProjectUserService, private projectService: ProjectsService) {}
    
    @Get()
    async GetAllEvents() {
        return this.eventService.GetAllEvents();
    }
    @Get('csv')
    async GetCsv() {
        let allEvents = await this.eventService.GetAllEventsForCsv();
        let csv = "Event Description;Username;Date;Project\n"
        allEvents = allEvents.map(async event => {
            let user = await this.userService.FindOneId(event.userId);
            let username = user.username;
            let project = await this.projectService.FindProjectForCSV(event.userId);
            let projectName = "";
            if (project) {
                projectName = project.name;
            }
            let date = event.date.toLocaleDateString();
            return await Promise.all([event.eventDescription, username, date, projectName]);
        })
        allEvents = await Promise.all(allEvents)
        allEvents.forEach(async event => {
            csv += event.join(';') + "\n";
        })
        appendFileSync("./contacts.csv", csv);
    }

    @Get(':id')
    async GetEvent(@Param('id') id: string) {
        let event = await this.eventService.GetEvent(id);
        if (!event) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return event
    }

    @Post()
    async CreateEvent(@Req() req, @Body() body: CreatedEventDto) {
        let me = await this.userService.FindOneUser(req.user.username);
        if (await this.eventService.SameDay(me.id, body.date)) {
            throw new UnauthorizedException();
        }
        if (body.eventType === 'RemoteWork') {
            if (await this.eventService.CheckSameWeek(me.id, body.date)) {
                throw new UnauthorizedException();
            }
        }
        let eventStatus = "Accepted";
        if (me.role === "Employee" && body.eventType === 'PaidLeave') {
            eventStatus = 'Pending';
        }
        let event: EventDto = {
            date: body.date,
            eventDescription: body.eventDescription,
            eventType: body.eventType,
            userId: me.id,
            eventStatus: eventStatus
        }
        return this.eventService.Create(event);
    }

    @Post(':id/validate')
    async ValidateEvent(@Req() req, @Param('id') id: string) {
        let me = await this.userService.FindOneUser(req.user.username);
        if (me.role === "Employee") {
            throw new UnauthorizedException();
        }
        let event = await this.eventService.GetEvent(id);
        if (!event) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        } else if (event.eventStatus === 'Accepted' || event.eventStatus === 'Rejected') {
            throw new UnauthorizedException();
        }
        let projectUser = await this.projectUserService.CheckOneDate(event.date, event.userId)
        if (projectUser) {
            if (me.role === "ProjectManager") {
                if (!await this.projectService.CheckManager(projectUser.projectId, me.id)) {
                    throw new UnauthorizedException();
                }
            }
            event.eventStatus = 'Accepted';
            return await this.eventService.Update(event);
        }
        throw new UnauthorizedException();
    }

    @Post(':id/decline')
    async DeclineEvent(@Req() req, @Param('id') id: string) {
        let me = await this.userService.FindOneUser(req.user.username);
        if (me.role === "Employee") {
            throw new UnauthorizedException();
        }
        let event = await this.eventService.GetEvent(id);
        if (!event) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        } else if (event.eventStatus === 'Accepted' || event.eventStatus === 'Rejected') {
            throw new UnauthorizedException();
        }
        let projectUser = await this.projectUserService.CheckOneDate(event.date, event.userId)
        if (projectUser) {
            if (me.role === "ProjectManager") {
                if (!await this.projectService.CheckManager(projectUser.projectId, me.id)) {
                    throw new UnauthorizedException();
                }
            }
            event.eventStatus = 'Rejected';
            return await this.eventService.Update(event);
        }
        throw new UnauthorizedException();
    }

}