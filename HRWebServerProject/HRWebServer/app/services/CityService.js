var City = require('../models/City');
var Province = require('../models/Province');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');

const getAllCities = () => {
    return City.find({})
        .populate('province', 'provinceCode provinceName')
}

const getCityById = (id) => {
    return City.findById(id)
        .populate('province', 'provinceCode provinceName')
}

const getCityListByProvinceId = (id) => {
    return City.find({ province: id })
        .populate('province', 'provinceCode provinceName')
}

const createCity = (req) => {
    return new Promise((resolve, reject) => {
        const city = new City(req.body);
        city.save()
            .then(() => {
                Province.findByIdAndUpdate(city.province,
                    { $push: { cities: city._id } })
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}
module.exports = {
    getAllCities,
    getCityById,
    getCityListByProvinceId,
    createCity
};
