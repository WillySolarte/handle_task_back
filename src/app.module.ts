import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
//import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Email } from './user/providers/email/email';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { NoteModule } from './note/note.module';
import config from './config';


@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATA_BASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
    TaskModule,
    NoteModule,
    
    
  ],
  providers: [Email],
  //providers: [AppService]
})
export class AppModule {}
