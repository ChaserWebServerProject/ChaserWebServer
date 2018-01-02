var City = require('../models/City');
var Province = require('../models/Province');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

getAllCities = () => {
    return City.find({})
        .populate('province', 'provinceCode provinceName')
}

getOneCityById = (id) => {
    return City.findById(id)
        .populate('province', 'provinceCode provinceName')
}

getCityListByProvinceId = (id) => {
    return City.find({ province: id })
        .populate('province', 'provinceCode provinceName')
}
module.exports = { getAllCities, getOneCityById, getCityListByProvinceId };
