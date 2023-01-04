/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Events } from './events/event.entity';
import { EventModule } from './events/events.module';
import { LoggerMiddleware } from './logger.middleware';
import { ProjectUser } from './project-users/project-users.entity';
import { ProjectUserModule } from './project-users/project-users.module';
import { Project } from './projects/projects.entity';
import { ProjectModule } from './projects/projects.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser, Events],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectModule,
    ProjectUserModule,
    AuthModule,
    EventModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
