const nodemailer=require('nodemailer')

exports. transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:  process.env.NODEMAILER_EMAIL,
    pass:  process.env.NODEMAILER_PASSWORD
  },
});