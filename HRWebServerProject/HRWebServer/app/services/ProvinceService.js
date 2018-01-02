var Province = require('../models/Province');
var City = require('../models/City');

getAllProvinces = () => {
    return Province.find({})
}

module.exports = { getAllProvinces };
