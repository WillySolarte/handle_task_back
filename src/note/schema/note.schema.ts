import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export interface INote {
  content: string;
  createdBy: Types.ObjectId;
  task: Types.ObjectId;
}

export type NoteDocument = HydratedDocument<INote>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'UserA', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  task: Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);