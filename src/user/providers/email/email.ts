/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()


@Injectable()
export class Email {

    async sendEmail(email: string, name: string, token: string, html: string){

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, 
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });

        try {
            await transporter.sendMail({
                from: 'Project Manager',
                to: email, 
                subject: "Confirma tu cuenta", 
                text: 'Confirma tu cuenta en Project Manager',
                html: html, 
            });
            
              
        } catch (error) {
            throw error
        }

    }
}
