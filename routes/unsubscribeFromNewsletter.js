const express = require('express');
const router = express.Router();
const NewsletterSub = require('../models/newsletterSub');

router.post('/', async (req, res) => {
	let email = req.body.email;

	NewsletterSub.findOne({ email: email }, async (err, doc) => {
        if(err) {
            res.json({ status: 'failed', error: err });
        } 
        if(doc == null){
            res.json({ status: 'failed', error: 'Your Email is not subscribed to the GringVoip newsletter'});
        }else{
            doc.remove();
            res.json({ status: 'success', message: 'Your email has been successfully removed from the GringVoip newsletter. Have a nice day.' });
        }
    });
});

module.exports = router;