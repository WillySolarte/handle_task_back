/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Email } from './providers/email/email';
import { ISendEmail } from 'src/common/interfaces/sendMail';
import { UserA } from './schema/userA.schema';
//import {} from './templates'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(UserA.name) private userAModel: Model<UserA>,
    private emailProvider: Email

  ) { }

  async create(createUserDto: CreateUserDto) {

    try {
      const { email } = createUserDto;
      const userExist = await this.userAModel.findOne({ email });

      if (userExist) {

        return { msg: 'El usuario ya existe', state: 'error', error: '' };
      }

      const createdUser = new this.userAModel(createUserDto);

      createdUser.password = bcrypt.hashSync(createUserDto.password, 10);
      createdUser.tkconfirmation = crypto.randomUUID();
      await this.sendMail({email: email, name: createdUser.name, token: createdUser.tkconfirmation, template: 'register'})

      await createdUser.save()
      return { msg: 'Usuario Almacenado correctamente', state: 'ok', error: '' };

    } catch (error) {
      return { msg: "Error en la conexión", state: 'error', error: error };

    }

  }
  async confirmAccount(token: string){
    try {
      
      const user = await this.userAModel.findOne({ tkconfirmation: token });
      
      if (!user) {
        
        return { msg: 'Error de confirmación', state: 'error', error: '' };
      }
      user.tkconfirmation = null;
      user.confirmed = true;
      await user.save()
      return { msg: 'Usuario Confirmado', state: 'ok', error: '' };
      
    } catch (error) {
      console.log(error)
      return { msg: "Error en la conexión", state: 'error', error };
    }
  }


  findAll() {
    return `This action returns all user`;
  }

  

  

  //mail functions
  async sendMail(body: ISendEmail) {
    try {
      const { email, name, token } = body
      
      const html = this.getTemplate(body)
      await this.emailProvider.sendEmail(email, name, token, html)
      return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { msg: "Error en el envio de mail", state: 'error' };
    }
  }

  private getTemplate(body: ISendEmail) {
    const template = this.getTemplateFile(body.template)
    const html = template.fillTemplate(body)
    return html
  }

  private getTemplateFile(template) {
    const path = './templates'
    const templateFile = require(`${path}/${template}`)
    return templateFile
  }
}
