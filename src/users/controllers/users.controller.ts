import { Body, Controller, Post, Get, Logger, Param } from '@nestjs/common';
import { CreatedUsersDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Req, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { AuthService } from '../../auth/services/auth.service';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserId } from '../dto/userId.dto';
import { EventService } from '../../events/services/events.service';
import * as dayjs from 'dayjs';


@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService, private authService: AuthService, private eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  GetAll(): {} {
    return this.usersService.GetAll();
  }

  @UsePipes(ValidationPipe)
  @Post('/auth/sign-up')
  SignUp(@Body() body: CreatedUsersDto): {} {   
    return this.usersService.Create(body);
  }

  @Post('auth/login')
  async login(@Body() body) {
    let user = await this.usersService.FindOneEmail(body.email);
    if (!user || user.password !== body.password) {
      throw new UnauthorizedException();
    }
    return this.authService.Login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  GetProfile(@Req() req) {
    let user = req.user.username;
    return this.usersService.FindOneUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Get(':id')
  async GetId(@Req() req) {
    try {
      let userId: UserId = {
        id: req.params.id,
      }
      const user = await this.usersService.FindOneId(userId.id);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/meal-vouchers/:month') 
  async GetMealVouchers(@Param('id') id: string, @Param('month') Month: string) {
    let month = parseInt(Month);
    const start = dayjs().month(month)
    const daysInMonth = start.daysInMonth()
    const workingDays = [1,2,3,4,5]
    let count = 0
    for (let i = 1; i <= daysInMonth; i++) {
      let date = dayjs().day(i).month(month).toDate()
      let event = await this.eventService.CheckMeal(date, id);
      if (event) {
        count--;
      } else if (workingDays.includes(dayjs().date(i).month(month).day())) {
        count ++;
      }
    }
    return count * 8;
  }
}