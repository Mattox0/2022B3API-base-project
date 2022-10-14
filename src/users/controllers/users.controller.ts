import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { CreatedUsersDto } from '../dto/users.dto';
import { User } from '../users.entity';
import { UsersService } from '../services/users.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UseGuards, UsePipes } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/services/auth.service';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Get()
  GetAll(): {} {
    return this.usersService.GetAll();
  }

  @UsePipes(ValidationPipe)
  @Post('/auth/sign-up')
  SignUp(@Body() body: CreatedUsersDto): {} {  
    let user: CreatedUsersDto = {
      username: body.username,
      email: body.email,
      password: body.password,
      role: body.role,
    }
    
    return this.usersService.Create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}