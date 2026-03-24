const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interaction', interactionSchema);
