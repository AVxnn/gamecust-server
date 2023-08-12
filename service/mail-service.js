import nodemailer from 'nodemailer';
import { SMTPClient } from 'emailjs';

export default async function SendEmail(to, link) {

    const client = new SMTPClient({
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        host: process.env.SMTP_HOST,
        ssl: true,
    });

    const message = {
        text: 'Активация аккаунта на ' + process.env.API_URL,
        from: process.env.SMTP_USER,
        to,
        cc: 'else <else@your-email.com>',
        subject: 'testing emailjs',
        attachment: [
            { data: `
            <div style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; width: 100%; display: flex; justify-content: center">
                <div style="width: 100%; max-width: 600px; margin: 50px; border: 1px solid black; padding: 10px 30px;">
                    <h2>Здравствуйте!</h2>
                    <p>Ваш аккаунт на сайте "GameCust" был успешно создан.</p>
                    <p>Чтобы активировать ваш аккаунт, пожалуйста, нажмите на ссылку ниже.</p>
                    <a href="${link}">${link}</a>
                    <p>Если вы не можете нажать на ссылку, скопируйте ее и вставьте в адресную строку вашего браузера.</p>
                    <h3>По всем вопросам обращайтесь в телеграм <a href="https://t.me/romashkog">@romashkog</a></h3>
                <div/>
            <div/>
            `, alternative: true },
            { path: 'path/to/file.zip', type: 'application/zip', name: 'renamed.zip' },
        ],
    };

    // send the message and get a callback with an error or details of the message that was sent
    client.send(message, function (err, message) {
        console.log(err || message);
    });

    // let message = {
    //     from: process.env.SMTP_USER,
    //     to,
    //     subject: 'Активация аккаунта на ' + process.env.API_URL,
    //     text: '',
    //     html:
    //         `
    //         <div style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; width: 100%; display: flex; justify-content: center">
    //             <div style="width: 100%; max-width: 600px; margin: 50px; border: 1px solid black; padding: 10px 30px;">
    //                 <h2>Здравствуйте!</h2>
    //                 <p>Ваш аккаунт на сайте "GameCust" был успешно создан.</p>
    //                 <p>Чтобы активировать ваш аккаунт, пожалуйста, нажмите на ссылку ниже.</p>
    //                 <a href="${link}">${link}</a>
    //                 <p>Если вы не можете нажать на ссылку, скопируйте ее и вставьте в адресную строку вашего браузера.</p>
    //                 <h3>По всем вопросам обращайтесь в телеграм <a href="https://t.me/romashkog">@romashkog</a></h3>
    //             <div/>
    //         <div/>
    //         `
    // };
    // const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASSWORD
    //     },
    //     secure: true,
    //     requireTLS: true,
    //     logger: true
    // });
    // await new Promise((resolve, reject) => {
    //     transporter.sendMail(message, (err, info) => {
    //         if (err) return console.log(err);
    //         console.log('email sent: ' + info)
    //     });
    //   });
    
}