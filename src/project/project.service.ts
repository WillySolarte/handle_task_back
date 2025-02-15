import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {

  constructor(
      @InjectModel(Project.name) private projectModel: Model<Project>,
      
  
    ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const project = new this.projectModel(createProjectDto);
    project.manager = new this.projectModel.base.Types.ObjectId(userId);

    try {
      await project.save();
      return { message: 'Proyecto creado correctamente' };
    } catch (error) {
      throw new Error('Error al consultar la BD');
    }
  }

  findAll(userId: string) {
    return this.projectModel.find({
      $or: [
        { manager: userId },
        { team: userId },
      ],
    }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
