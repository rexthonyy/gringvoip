const express = require('express');
const router = express.Router();
const NewsletterSub = require('../models/newsletterSub');
const util = require('../libs/util');

router.post('/', async (req, res) => {
	let email = req.body.email;

	NewsletterSub.findOne({ email: email }, async (err, doc) => {
        if(err) {
            res.json({ status: 'failed', error: err });
        } 
        if(doc != null){
            res.json({ status: 'failed', error: 'Email is already subscribed'});
        }else{

        	const subscriber = new NewsletterSub({
        		email: email
        	});

        	try{
				const newSubscriber = await subscriber.save();

				let message = sendEmailTo(req, newSubscriber);

				res.status(201).json({ status: 'success', msg: message});
			}catch(err){
				res.status(500).json({ status: 'failed', error: 'Failed to create entry' });
			}
        }
    });
});

function sendEmailTo(req, subscriber){

	let currentDate = new Date();
	let fullYear = currentDate.getFullYear();

	//send user email
	let name = "GringVoip";
	let from = "gringvoip@gmail.com";
	let to = subscriber.email;
	let subject = "Thank you for subscribing for the GringVoip Newsletter";
	let message = `
	<table width='100%' border='0'>
		<thead>
			<tr>
				<th style='padding:30px 30px; background-color:rgb(220, 220, 220); color:rgb(150, 150, 150); font-family:Verdana;'>${name}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style='padding:30px 30px; color:rgb(50, 50, 50); font-family:Verdana; line-height:1.8em;'>
				Hi,<br/></br>Thank you for subscribing for the GringVoip newsletter.

				<br/><br/>
				GringVoip is a <b>new kind of social media network</b> developed by people and for people. 
				GringVoip leverages on natural human interaction using voice and video.
				You will be provided with app updates and get to know when we launch so that you can <b>reserve your username</b>
				and be the first to try out the cool new features.

				<br/><br/>
				Thanks,
				<br/>Support Team, GringVoip

				<br/><br/>
				Click <a href='${util.getHostUrl(req)}/unsubscribeFromNewsletter.html?id=${subscriber._id}'>here</a> to unsubscribe
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td style='padding:30px 30px; background-color:rgb(220, 220, 220); color:rgb(150, 150, 150); font-family:Verdana; text-align: center;'>&copy; ${fullYear} All Rights reserved.</td>
			</tr>
		</tfoot>
	</table>
	`;
		
	let data = { 
		name: name,
		from: from,
		to: to,
		subject: subject,
		message: message 
	};

	let url = "http://rexthonyy.000webhostapp.com/apps/personal/EmailSender/sendEmailJSRequest.php";

	util.sendPostRequest(url, data)
	.then(json => {
		if(json.status == 'success'){
			return "Email sent successfully";
		}else{
			return "Failed to send email";
		}
	}).catch(err => {
		console.error(err);
	});
}

module.exports = router;