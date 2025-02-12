import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    getUsers() {
        return 'Desde el service'
    }
}
