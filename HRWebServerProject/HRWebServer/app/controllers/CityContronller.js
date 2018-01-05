var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const modelObjectId = mongoose.Types.ObjectId;

var City = require('../models/City');
var Province = require('../models/Province');
var Job = require('../models/Job');
var JobExtend = require('../models/JobExtend');


const {
    getAllCities,
    getCityById,
    getCityListByProvinceId,
    createCity
} = require('../services/CityService');

/* GET ALL CITIES */
router.get('/city/get_all_cities', function (req, res, next) {
    getAllCities()
        .exec()
        .then(cities => res.json(cities))
        .catch(err => res.json(err));
});

/* GET CITY BY ID */
router.get('/city/get_city_by_id/:id', function (req, res, next) {
    getCityById(req.params.id)
        .exec()
        .then(city => res.json(city))
        .catch(err => res.json(err));
});

/* GET LIST OF CITY BY PROVINCE ID */
router.get('/city/get_city_list_by_province_id/:id', function (req, res, next) {
    if (!modelObjectId.isValid(req.params.id)) {
        res.json([]);
    }
    else {
        getCityListByProvinceId(req.params.id)
            .exec()
            .then(cities => res.json(cities))
            .catch(err => res.json(err));
    }
});

// CREATE NEW CITY
router.post('/city/create_city', function (req, res, next) {
    createCity(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

/* UPDATE CITY */
router.put('/city/update_city/:id', function (req, res, next) {
    const id = req.params.id;
    City.findByIdAndUpdate(id, req.body, function (err) {
        if (err) return res.json({ success: false, err: err });
        else {
            City.findById(id)
                .then(err => res.json({ success: false, err: err }))
                .then(city => res.json({ success: true, city: city }));
        }
    });
});

/* DELETE CITY */
router.delete('/city/delete_city/:id', function (req, res, next) {
    City.findByIdAndRemove(req.params.id, function (err, city) {
        if (err) return res.json({ success: false, err: err });
        else {
            Province.findById(city.province, function (err, province) {
                if (err) return res.json({ success: false, err: err });
                else {
                    let cities = province.cities;
                    cities.splice(cities.indexOf(req.params.id), req.params.id);
                    province.save()
                        .then(async () => {
                            const job = await Job.findOne({ city: id })
                                .catch(err => res.json({ success: false, err: err }));
                            JobExtend.findOneAndRemove({ job: job._id })
                                .then(() => {
                                    job.remove()
                                        .then(() => res.json({ success: true }))
                                        .catch(err => res.json({ success: false, err: err }));
                                })
                                .catch(err => res.json({ success: false, err: err }));
                        })
                        .catch(err => res.json({ success: false, err: err }));
                }
            });
        }
    });
});

module.exports = router;