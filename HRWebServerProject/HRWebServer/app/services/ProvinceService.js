var Province = require('../models/Province');
var City = require('../models/City');

const getAllProvinces = () => {
    return Province.find({})
        .populate('cities');
}

const getProvinceById = (id) => {
    return Province.findById(id)
        .populate('cities');
}

const createProvince = (req) => {
    return new Promise((resolve, reject) => {
        const province = new Province(req.body);
        province.save()
            .then(() => resolve(true))
            .catch(err => reject(err));
    });
}
module.exports = {
    getAllProvinces,
    getProvinceById,
    createProvince
};
