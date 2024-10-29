const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linksSchema = new Schema ({
    shortenedLink: {
        type: String,
        required: true,        
    },
    redirectTo: {
        type: String,
        required: true,        
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('link', linksSchema);
