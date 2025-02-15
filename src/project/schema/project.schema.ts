import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export interface IProject {
  projectName: string;
  clientName: string;
  description: string;
  task: Types.ObjectId[];
  manager: Types.ObjectId;
  team: Types.ObjectId[];
}

export type ProjectDocument = HydratedDocument<IProject>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  projectName: string;

  @Prop({ required: true, trim: true })
  clientName: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  task: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'UserA', required: true })
  manager: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserA' }] })
  team: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
