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

    Create(user: CreatedUsersDto): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    FindOneEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({ where: {email: email} });
    }

    FindOneUser(username: string): Promise<User> {
        return this.usersRepository.findOne({ where: {username: username} });
    }

    FindOneId(id: string): Promise<User> {
        return this.usersRepository.findOne({ where: {id: id} });
    }
}
