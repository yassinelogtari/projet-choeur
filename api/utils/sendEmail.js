const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (email, subject, text,attachments=[]) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			port: process.env.EMAIL_PORT,
			secure: process.env.SECURE,
			auth: {
			  user: process.env.USER,
			  pass: process.env.PASS,
			},
		  });
		  const mailOptions={
			from: process.env.USER,
			to: email,
			subject: subject,
			html: text,

		  }
		if(attachments && attachments.length>0){
			mailOptions.attachments=attachments
		}
		await transporter.sendMail(mailOptions)
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
