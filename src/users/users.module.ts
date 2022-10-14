import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './users.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService, JwtService],
    exports: [UsersModule, UsersService, JwtService],
})
export class UsersModule {}