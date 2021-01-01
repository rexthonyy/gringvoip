const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('NewsletterSubscribers', newsletterSubscriberSchema);