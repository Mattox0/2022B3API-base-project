import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreatedUsersDto } from '../dto/users.dto';
import { User } from '../users.entity';
import { UsersService } from '../services/users.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  GetAll(): {} {
    return this.usersService.GetAll();
  }

  @Post('/auth/sign-up')
  SignUp(@Body() body: CreatedUsersDto): {} {
    if (!body.role || body.role !== 'Admin' && body.role !== 'ProjectManager') {
      body.role = 'Employee';
    }
    if (!body.username || body.username.length < 3) {
      throw new HttpException({
        status: 400,
        error: 'Username must be at least 3 characters long',
      }, HttpStatus.FORBIDDEN)
    } else if (!body.password || body.password.length < 8) {
      throw new HttpException({
        status: 400,
        error: 'Password must be at least 8 characters long',
      }, HttpStatus.FORBIDDEN)
    } else if (!body.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(body.email)) {
      throw new HttpException({
        status: 400,
        error: 'Email incorrect',
      }, HttpStatus.FORBIDDEN)
    }

    let user: CreatedUsersDto = {
      username: body.username,
      email: body.email,
      password: body.password,
      role: body.role,
    }
    
    this.usersService.Create(user);

    return { "success": true , "message": "User created successfully", "data": user };
  }
}