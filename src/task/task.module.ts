import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectB, ProjectBSchema } from 'src/project/schema/projectB.schema';
import { TaskB, TaskBSchema } from './schema/taskB.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: ProjectB.name, schema: ProjectBSchema },
        { name: TaskB.name, schema: TaskBSchema }]), UserModule
      
    ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
