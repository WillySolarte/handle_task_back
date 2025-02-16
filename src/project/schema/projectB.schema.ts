import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, PopulatedDoc, Types } from 'mongoose';
import { ITaskB } from 'src/task/schema/taskB.schema';

import { IUserA } from 'src/user/schema/userA.schema';


export interface IProjectB {
  projectName: string;
  clientName: string;
  description: string;
  task: PopulatedDoc<ITaskB & Document>[],
  manager: PopulatedDoc<IUserA & Document>,
  team: PopulatedDoc<IUserA & Document>[]
}

export type ProjectBDocument = HydratedDocument<IProjectB>;

@Schema({ timestamps: true })
export class ProjectB {
  @Prop({ required: true, trim: true })
  projectName: string;

  @Prop({ required: true, trim: true })
  clientName: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'TaskB' }] })
  task: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'UserA', required: true })
  manager: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserA' }] })
  team: Types.ObjectId[];
}

export const ProjectBSchema = SchemaFactory.createForClass(ProjectB);
