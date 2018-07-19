const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    lockoutEnabled: {
        type: Boolean,
        default: false
    },
    lockoutEndDate: {
        type: Date,
        default: Date.now
    },
    userName: {
        type: String,
        required: true,
        maxlength: 100
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 6
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        maxlength: 256,
        default: ''
    },
    mobile: {
        type: String,
        maxlength: 11,
        default: ''
    },
    userExtend: {
        type: Schema.Types.ObjectId,
        ref: 'user_extend',
        default: null
    },
    userPhotos: [{
        type: Schema.Types.ObjectId,
        ref: 'user_photo'
    }],
    createdJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'job'
    }],
    markedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'job'
    }],
    city: {
        type: Schema.Types.ObjectId,
        ref: 'city',
        default: null
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        default: null
    },
    joinedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'job'
    }],
    userRole: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    }

    // province: { type: Number, ref: 'province' },
    // userExtend: { type: String, ref: 'user_extend' }
});

const User = mongoose.model('user', userSchema);

module.exports = User;