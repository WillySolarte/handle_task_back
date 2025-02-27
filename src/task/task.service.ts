
import { HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectB } from 'src/project/schema/projectB.schema';
import { TaskB } from './schema/taskB.schema';
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

      if (!project) throw new NotFoundException('Proyecto no encontrado');


      if (project.manager.toString() !== userId) throw new UnauthorizedException('No es manager');

      const task = new this.taskBModel(createTaskDto)
      task.project = project.id as Types.ObjectId
      project.task.push(task._id)
      await Promise.all([task.save(), project.save()])
      return 'Tarea creada correctamente'
    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  findAll() {
    return `This action returns all task`;
  }

  async findOne(projectId: string, taskId: string) {

    try {

      const project = await this.projectBModel.findById(projectId)

      if (!project) throw new NotFoundException('Proyecto no encontrado');

      const task = await this.taskBModel.findById(taskId)
        .populate({ path: 'completedBy.user', select: 'id name email' })
        .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } });


      if (!task) throw new NotFoundException('Tarea no encontrada');

      if (task.project !== project.id) throw new UnauthorizedException('No es manager');

      return task;



    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la conexión');
    }

  }

  async updateTaskStatus(updateStatusTaskDto: UpdateStatusTaskDto, userId: string, projectId: string, taskId: string) {

    const { status } = updateStatusTaskDto

    try {
      const project = await this.projectBModel.findById(projectId)

      if (!project) throw new NotFoundException('Proyecto no encontrado');

      const task = await this.taskBModel.findById(taskId);
      if (!task) throw new NotFoundException('Tarea no encontrada');


      task.status = status;
      task.completedBy.push({ user: new Types.ObjectId(userId), status: updateStatusTaskDto.status });

      await task.save();
      
      return 'estatus actualizado'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la conexión');
    }



  }

  async update(updateTaskDto: UpdateTaskDto, projectId: string, taskId: string, userId: string) {

    try {
      
      const project = await this.projectBModel.findById(projectId)

      if (!project)  throw new NotFoundException('Proyecto no encontrado');

      if (project.manager.toString() !== userId) throw new UnauthorizedException('No es manager');

      const task = await this.taskBModel.findById(taskId)

      if (!task) throw new NotFoundException('Tarea no encontrada');

      const { name, description } = updateTaskDto;
      task.name = name;
      task.description = description;

      await task.save()

      return 'Tarea actualizada correctamente'
      

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la conexión');
    }


  }

  async remove(projectId: string, taskId: string, userId: string) {
    try {
      const project = await this.projectBModel.findById(projectId);
      if (!project) throw new NotFoundException('Proyecto no encontrado');

      if (project.manager.toString() !== userId) throw new UnauthorizedException('No es manager');

      const task = await this.taskBModel.findById(taskId);
      if (!task)  throw new NotFoundException('Tarea no encontrada');

      project.task = project.task.filter(currentTask => currentTask.toString() !== taskId.toString());
      await Promise.allSettled([task.deleteOne(), project.save()]);

      return 'Tarea eliminada'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la conexión');
    }
  }
}
