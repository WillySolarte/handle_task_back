/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectB } from 'src/project/schema/projectB.schema';
import { TaskB, taskStatus } from './schema/taskB.schema';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';

@Injectable()
export class TaskService {

  constructor(
    @InjectModel(TaskB.name) private taskBModel: Model<TaskB>,
    @InjectModel(ProjectB.name) private projectBModel: Model<ProjectB>,
  
  
  ) { }
    
  async create(createTaskDto: CreateTaskDto, projectId: string, userId: string) {
    

    try {
      const project = await this.projectBModel.findById(projectId)
      
      if(!project){
        return { msg: 'Proyecto no encontrado ', state: 'error', data: '' };
      }
      if(project.manager.toString() !== userId){
        return { msg: 'No es dueño del proyecto ', state: 'error', data: '' };
      }
      
      const task =  new this.taskBModel(createTaskDto)
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

  async findOne(projectId: string, taskId: string) {
    
    try {
        
      const project = await this.projectBModel.findById(projectId)

      if(!project) return { msg: 'Proyecto no existe ', state: 'error', data: null };

      const task = await this.taskBModel.findById(taskId)
        .populate({ path: 'completedBy.user', select: 'id name email' })
        .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } });

      
      if (!task) return { msg: 'Tarea no encontrada ', state: 'error', data: null };
      
      if(task.project !== project.id) return { msg: 'No autorizado ', state: 'error', data: null };

      return  { msg: 'Operación exitosa', state: 'ok', data: task };

      
    
    } catch (error) {
      return { msg: 'Error en la conexión', state: 'error', data: null };
    }
      
  }

  async updateTaskStatus(updateStatusTaskDto: UpdateStatusTaskDto, userId: string, projectId: string, taskId: string ){

    const {status} = updateStatusTaskDto
    
    try {
      const project = await this.projectBModel.findById(projectId)

      if(!project) return { msg: 'Proyecto no existe ', state: 'error', data: null };

      const task = await this.taskBModel.findById(taskId);
      if (!task) return { msg: 'Tarea no encontrada ', state: 'error', data: null };

      if(task.project !== project.id) return { msg: 'No autorizado ', state: 'error', data: null };

      task.status = status;
      task.completedBy.push({ user: new Types.ObjectId(userId), status: updateStatusTaskDto.status });

      await task.save();
      return { msg: 'Status de tarea actualizado', state: 'ok', data: null };
    } catch (error) {
      return { msg: 'Error en la conexión', state: 'error', data: null };
    }



  }

  async update(updateTaskDto: UpdateTaskDto, projectId: string, taskId: string, userId: string) {
    
    try {

      const project = await this.projectBModel.findById(projectId)
      
      if(!project) return { msg: 'Proyecto no encontrado ', state: 'error', data: '' };

      if(project.manager.toString() !== userId) return { msg: 'No es dueño del proyecto ', state: 'error', data: '' };

      const task = await this.taskBModel.findById(taskId)

      if(!task) return { msg: 'Tarea no encontrada ', state: 'error', data: '' };

      const {name, description} = updateTaskDto;
      task.name = name;
      task.description = description;

      await task.save()

      return { msg: 'Tarea modificada', state: 'ok', data: '' };
      
    } catch (error) {
      return { msg: 'Error en la conexión', state: 'error', data: '' };
    }


  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
