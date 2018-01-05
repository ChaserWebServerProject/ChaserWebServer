const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userExtendSchema = new Schema({
    // userId: { type: String, default: '' },//user.id
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: Boolean,
        required: true
    },//true: Male, false: Female,
    hightSchool: {
        type: String,
        maxlength: 100,
        default: '',
        trim: true
    },
    university: {
        type: String,
        maxlength: 100,
        default: '',
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

module.exports = mongoose.model('user_extend', userExtendSchema);
