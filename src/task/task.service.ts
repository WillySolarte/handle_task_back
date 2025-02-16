/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { Project } from 'src/project/schema/project.schema';

@Injectable()
export class TaskService {

  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  
  
  ) { }
    
  async create(createTaskDto: CreateTaskDto, projectId: string) {

    try {
      const project = await this.projectModel.findById(projectId)
      
      if(!project){
        return { msg: 'Proyecto no encontrado ', state: 'error', data: '' };
      }
      const task =  new this.taskModel(createTaskDto)
      task.project = project.id
      project.task.push(task._id)
      await Promise.all([task.save(), project.save()])
      return { msg: 'Tarea guardada ', state: 'ok', data: '' };
    } catch (error) {
      
      return { msg: 'Error en la conexión ', state: 'error', data: error };
    }
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
