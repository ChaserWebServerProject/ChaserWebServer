const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    lockoutEnabled: { type: Boolean, default: false },
    lockoutEndDate: { type: Date, default: Date.now },
    userName: { type: String, required: true, maxlength: 20 },
    passwordHash: { type: String, required: true, minlength: 6 },
    createdDate: { type: Date, default: Date.now },
    email: { type: String, maxlength: 256, default: '' },
    userExtend: { type: Schema.Types.ObjectId, ref: 'user_extend', default: null },
    userPhotos: [{ type: Number, ref: 'user_photo' }],
    createdJobs: [{ type: Number, ref: 'job' }],
    markedJobs: [{ type: Number, ref: 'job' }],
    city: { type: Number, ref: 'city', default: null },
    company: { type: Number, ref: 'company', default: null }
    // province: { type: Number, ref: 'province' },
    // userExtend: { type: String, ref: 'user_extend' }
});

const User = mongoose.model('user', userSchema);

module.exports = User;