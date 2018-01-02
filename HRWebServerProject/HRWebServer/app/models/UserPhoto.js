const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

var userPhotoSchema = new Schema({
    // userId: { type: Number },
    urlPath: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    type: { type: Number, required: true, min: 0, max: 3 },//0: Avatar, 1: Image, 2: Background
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true }
});

module.exports = mongoose.model('user_photo', userPhotoSchema);
