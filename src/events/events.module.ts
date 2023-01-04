import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { EventsController } from './controllers/events.controller';
import { EventService } from './services/events.service';
import { Events } from './event.entity';
import { ProjectUserModule } from '../project-users/project-users.module';
import { ProjectModule } from '../projects/projects.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
    imports: [
        TypeOrmModule.forFeature([Events]),
        forwardRef(() => UsersModule),
        ProjectUserModule,
        ProjectModule
    ],
    controllers: [EventsController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}