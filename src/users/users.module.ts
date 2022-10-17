import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './users.entity';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService, JwtService, LocalStrategy, JwtStrategy],
    // exports: [UsersModule, UsersService, JwtService],
})
export class UsersModule {}