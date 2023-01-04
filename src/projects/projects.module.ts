import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { UsersModule } from '../users/users.module';
import { ProjectUserModule } from '../project-users/project-users.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        forwardRef(() => UsersModule),
        forwardRef(() => ProjectUserModule),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectModule {}