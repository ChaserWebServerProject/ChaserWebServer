var express = require('express');
var router = express.Router();

const {
    createRole
} = require('../services/RoleService');

// CREATE NEW ROLE
router.post('/role/create_role', function (req, res, next) {
    createRole(req)
        .then(result => res.json({
            success: result
        }))
        .catch(err => res.json({
            success: false,
            err: err
        }));
});

module.exports = router;