import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserASchema, UserA } from './schema/userA.schema';
import { Email } from './providers/email/email';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';

@Module({
  imports: [MongooseModule.forFeature([{name: UserA.name, schema: UserASchema}]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret
  }),
  ],
  controllers: [UserController],
  providers: [UserService, UserA, Email],
  exports: [UserService],
})
export class UserModule {}
