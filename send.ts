const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const forgetCode = (to: string, code: string) => {
	const html = `<div>
		<h2>Mã xác nhận:</h2>
		<div
			style="
				width: fit-content;
				border: 1px solid #fffcf7;
				background-color: #a1b5d8;
				color: #fffcf7;
				font-size: large;
				font-weight: bold;
				padding: 10px 20px;
				letter-spacing: 10px;
				font-family: sans-serif;
				margin-left: 200px;
			"
		>${code}</div>
	</div>`;
	const msg = {
		to,
		from: 'alert@project3.tk', // Use the email address or domain you verified above
		subject: 'Lấy lại mật khẩu',
		text: 'and easy to do anywhere, even with Node.js',
		html,
	};
	sgMail.send(msg).then(
		() => {},
		(error: any) => {
			console.error(error);

			if (error.response) {
				console.error(error.response.body);
			}
		}
	);
};
