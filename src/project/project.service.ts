/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectB } from './schema/projectB.schema';
import { UserA } from 'src/user/schema/userA.schema';
import { TaskB } from 'src/task/schema/taskB.schema';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(ProjectB.name) private projectBModel: Model<ProjectB>,
    @InjectModel(UserA.name) private userAModel: Model<UserA>,
    @InjectModel(TaskB.name) private taskBModel: Model<TaskB>,

  ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {

    const project = new this.projectBModel(createProjectDto);
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
    const projects = await this.projectBModel.find({
      $or: [
        { manager: objectId },
        { team: { $in: [userId] } },
      ],
    }).exec();
    return projects
  }

  async findOne(id: string, userId: string) {

    try {
      const project = await this.projectBModel.findById(id).populate({
        path: 'task',
        model: 'TaskB' 
      });

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

      const project = await this.projectBModel.findById(id);


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
    const project = await this.projectBModel.findById(id);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.manager.toString() !== userId) {
      throw new UnauthorizedException('Solo el manager puede eliminar el proyecto');
    }

    try {

      await this.taskBModel.deleteMany({ _id: { $in: project.task } });

      await project.deleteOne();
      return { message: 'Proyecto eliminado correctamente' };
    } catch (error) {
      throw new Error('Error al consultar la BD: ' + error);
    }
  }

  async findMemberByEmail(email: string) {
    try {
      const user = await this.userAModel.findOne({ email });
      
      if (!user) return { msg: 'Usuario no encontrado', state: 'error', data: null };

      const objetOutput = {
        _id: user.id,
        email: user.email,
        name: user.name
      }

      return { msg: 'Usuario ubicado', state: 'ok', data: objetOutput };
    } catch (error) {
      return { msg: 'Error de conexión', state: 'error', data: '' }
    }
  }

  async getProjectTeam(projectId: string) {
    try {
      const project = await this.projectBModel.findById(projectId).populate({ path: 'team', model: 'UserA', select: 'id name email' });
      if (!project) return { msg: 'Proyecto no encontrado', state: 'error', data: null };
      
      return { msg: 'Consulta exitosa', state: 'ok', data: project.team };

    } catch (error) {
      return { msg: 'Error de conexión', state: 'error', data: null };
    }
  }

  async addMemberById(projectId: string, userId: string) {
    try {
      const user = await this.userAModel.findById(userId);
      if (!user) return { msg: 'Usuario no encontrado', state: 'error', data: null };

      const project = await this.projectBModel.findById(projectId);
      if (!project) {
        return { msg: 'Proyecto no encontrado', state: 'error', data: null };
      }

      
      if (project.team.some(teamMember => teamMember.toString() === user.id.toString())) {
        return { msg: 'El usuario ya existe', state: 'error', data: null };
      }

      if(project.manager.toString() === userId){
        return { msg: 'El usuario es manager', state: 'error', data: null };
      }

      project.team.push(user.id);
      await project.save();
      return { msg: 'Usuario agregado correctamente', state: 'ok', data: null };
    } catch (error) {
      return { msg: 'Error de conexión', state: 'error', data: null };
    }
  }

  async removeMemberById(projectId: string, userId: string, idUserActive: string) {
    try {
      
      const project = await this.projectBModel.findById(projectId);
      if (!project) {
        return { msg: 'Proyecto no encontrado', state: 'error', data: null };
      }
      
      if (!project.team.some(teamMember => teamMember.toString() === userId)) {
        return { msg: 'El usuario no existe en el proyecto', state: 'error', data: null };
      }

      if(project.manager.toString() !== idUserActive){
        return { msg: 'Solo el manager puede eliminar', state: 'error', data: null };
      }

      project.team = project.team.filter(teamMember => teamMember.toString() !== userId);
      await project.save();
      return { msg: 'Usuario eliminado correctamente', state: 'ok', data: null };
    } catch (error) {
      return { msg: 'Error al consultar la BD', state: 'error', data: null };
    }
  }




}
