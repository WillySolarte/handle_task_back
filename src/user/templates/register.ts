import { ISendEmail } from "src/common/interfaces/sendMail";
import * as dotenv from 'dotenv'
dotenv.config()

export const fillTemplate = (body:ISendEmail) => `

    <p>Hola ${body.name} confirma tu cuenta</p>

    <p>Para confirmar tu cuenta debes dar click en el siguiente enlace
                
        <a href="${process.env.FRONT_URL}/user/confirmation/${body.token}">Confirmar</a>
    </p>
    <p>Si no creaste la cuenta, ignora el mensaje</p>

`