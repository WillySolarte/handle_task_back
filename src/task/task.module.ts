import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/project/schema/project.schema';
import { Task, TaskSchema } from './schema/task.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema },
        { name: Task.name, schema: TaskSchema }]),
      
    ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
