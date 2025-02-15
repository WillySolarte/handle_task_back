import {   CanActivate,  ExecutionContext,  Injectable,  UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant'; 
import { Request } from 'express';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: {email: string} = await this.jwtService.verifyAsync(token,{secret: jwtConstants.secret});
      const user = await this.userService.findByEmail(payload.email)
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
