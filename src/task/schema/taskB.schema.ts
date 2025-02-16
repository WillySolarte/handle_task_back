import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgres',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITaskB {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: { user: Types.ObjectId; status: TaskStatus }[];
  notes: Types.ObjectId[];
}

export type TaskDocument = HydratedDocument<ITaskB>;

@Schema({ timestamps: true })
export class TaskB {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'ProjectB', required: true })
  project: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING })
  status: TaskStatus;

  @Prop({
    type: [{
      user: { type: Types.ObjectId, ref: 'UserA' },
      status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING },
    }],
  })
  completedBy: { user: Types.ObjectId; status: TaskStatus }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Note' }] })
  notes: Types.ObjectId[];
}

export const TaskBSchema = SchemaFactory.createForClass(TaskB);
