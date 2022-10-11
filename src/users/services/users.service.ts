import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedUsersDto } from '../dto/users.dto';
import { User } from '../users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    
    GetAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    Create(user: CreatedUsersDto): CreatedUsersDto {
        const newUser = this.usersRepository.create(user);
        this.usersRepository.save(newUser);
        return user;
    }
}