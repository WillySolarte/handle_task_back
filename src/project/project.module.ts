
import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ProjectB, ProjectBSchema } from './schema/projectB.schema';
import { TaskB, TaskBSchema } from 'src/task/schema/taskB.schema';
import { UserA, UserASchema } from 'src/user/schema/userA.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProjectB.name, schema: ProjectBSchema },
      { name: TaskB.name, schema: TaskBSchema }, {name: UserA.name, schema: UserASchema}

    ]),
    UserModule, 
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
