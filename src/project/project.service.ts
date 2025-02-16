/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,


  ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {

    const project = new this.projectModel(createProjectDto);
    project.manager = new Types.ObjectId(userId);

    try {
      await project.save();
      return { msg: 'Proyecto creado ', state: 'ok', data: '' };
    } catch (error) {

      return { msg: 'Error en la creación', state: 'error', data: error };
    }
  }

  async findAll(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const projects = await this.projectModel.find({
      $or: [
        { manager: objectId },
        { team: objectId },
      ],
    }).exec();
    return projects
  }

  async findOne(id: string, userId: string) {

    try {
      const project = await this.projectModel.findById(id).populate('task');

      if (!project) {
        return { msg: 'Proyecto no encontrado', state: 'error', data: '' };
      }
      const isManager = project.manager.toString() === userId;
      const isTeamMember = project.team.some(member => member.toString() === userId);

      if (!isManager && !isTeamMember) {
        return { msg: 'Acción no válida', state: 'error', data: '' };
      }

      return { msg: 'Proyecto encontrado', state: 'ok', data: project };;

    } catch (error) {
      return { msg: 'Error en la Conexión', state: 'error', data: error };
    }

  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {


    try {

      const project = await this.projectModel.findById(id);


      if (!project) {
        return { msg: 'Proyecto no encontrado', state: 'error', data: '' };
      }

      if (project.manager.toString() !== userId) {
        return { msg: 'Operación no autorizada', state: 'error', data: '' };
      }

      project.projectName = updateProjectDto.projectName;
      project.clientName = updateProjectDto.clientName;
      project.description = updateProjectDto.description;


      await project.save();
      return { msg: 'Proyecto Actualizado', state: 'ok', data: '' };
    } catch (error) {
      return { msg: 'Error en la conexión', state: 'error', data: error };
    }
  }

  async remove(id: string, userId: string) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.manager.toString() !== userId) {
      throw new UnauthorizedException('Solo el manager puede eliminar el proyecto');
    }

    try {
      await project.deleteOne();
      return { message: 'Proyecto eliminado correctamente' };
    } catch (error) {
      throw new Error('Error al consultar la BD: ' + error);
    }
  }
}
