import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserASchema, UserA } from './schema/userA.schema';
import { Email } from './providers/email/email';

@Module({
  imports: [MongooseModule.forFeature([{name: UserA.name, schema: UserASchema}])],
  controllers: [UserController],
  providers: [UserService, UserA, Email],
})
export class UserModule {}
