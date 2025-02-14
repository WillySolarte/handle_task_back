import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose'

export interface IUserA {
    
  email: string,
  password: string,
  name: string,
  confirmed: boolean,
  tkconfirmation? : string | null
}

export type UserASchema = HydratedDocument<IUserA>

@Schema({ timestamps: true }) 
export class UserA {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ type: String, nullable: true, default: null })
  tkconfirmation?: string | null;
}

export const UserASchema = SchemaFactory.createForClass(UserA);