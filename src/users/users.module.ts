import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './users.entity';
import { forwardRef } from '@nestjs/common/utils';
import { EventModule } from '../events/events.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), forwardRef(() => EventModule)],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}