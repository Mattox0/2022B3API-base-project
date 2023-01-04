import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './project-users.entity';
import { ProjectUserService } from './services/project-users.service';
import { ProjectUserController } from './controllers/project-users.controllers';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../projects/projects.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectUser]),
        forwardRef(() => UsersModule),
        forwardRef(() => ProjectModule),
    ],
    controllers: [ProjectUserController],
    providers: [ProjectUserService],
    exports: [ProjectUserService],
})
export class ProjectUserModule {}