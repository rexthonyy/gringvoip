const express = require('express');
const router = express.Router();
const NewsletterSub = require('../models/newsletterSub');

router.get('/', async (req, res) => {
	let subscriberId = req.query.id;

	NewsletterSub.findOne({ _id: subscriberId }, async (err, doc) => {
        if(err) {
            res.json({ status: 'failed', error: err });
        } 
        if(doc == null){
            res.json({ status: 'failed', error: 'Your Email is not subscribed to the GringVoip newsletter'});
        }else{
            res.json({ status: 'success', subscriber: doc });
        }
    });
});

module.exports = router;