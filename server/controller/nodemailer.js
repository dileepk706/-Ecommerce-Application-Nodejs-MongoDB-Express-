const nodemailer=require('nodemailer')

exports. transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'dlpkmr706@gmail.com',
    pass: 'gngwuxhuntuhtrro',
  },
});