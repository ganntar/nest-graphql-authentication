import { Injectable, NotImplementedException } from "@nestjs/common";
import { createTransport } from "nodemailer";

@Injectable()
export class Mailer{
    async sendMail(to: string, subject: string){
        const transporter = await createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: "ganntar@enterprise.com",
            to,
            subject
        })
        if(!info){
            throw new NotImplementedException('Email não enviado!')
        }

        return `Mensage send success to: ${info.envelope.to}`
    }
}