var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userController = require('./app/controllers/UserController');
var provinceController = require('./app/controllers/ProvinceController');
var cityContronller = require('./app/controllers/CityContronller');
var jobTypeController = require('./app/controllers/JobTypeController');
var jobController = require('./app/controllers/JobController');
var companyController = require('./app/controllers/CompanyController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use('/service',
    [
        userController,
        provinceController,
        cityContronller,
        jobTypeController,
        jobController,
        companyController
    ]
);

var databaseUri = 'mongodb://localhost/human_resource_db';
mongoose.Promise = global.Promise;
mongoose.connect(databaseUri, { useMongoClient: true })
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.listen(3000, () => console.log('Server started!'));
app.get('/', (req, res) => res.render('app'));