const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var companySchema = new Schema({
    orderId: {
        type: Number
    },
    companyName: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    companyExtend: {
        type: Schema.Types.ObjectId,
        ref: 'company_extend',
        default: null
    },
    // jobs: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'job'
    //     }
    // ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
});

companySchema.plugin(autoIncrement.plugin, { model: 'company', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('company', companySchema);
