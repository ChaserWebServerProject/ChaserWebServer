const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var testSchema = new Schema({
    orderId: {
        type: Number
    },
    name: {
        type: Number
    }
});

testSchema.plugin(autoIncrement.plugin, { model: 'test', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('test', testSchema, 'tests');
