const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var roleSchema = new Schema({
    orderId: {
        type: Number
    },
    roleName: {
        type: String,
        required:true,
        maxlength: 20
    }
});

roleSchema.plugin(autoIncrement.plugin, { model: 'role', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('role', roleSchema);