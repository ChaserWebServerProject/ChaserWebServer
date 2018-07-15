const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userController = require('./app/controllers/UserController');
const provinceController = require('./app/controllers/ProvinceController');
const cityContronller = require('./app/controllers/CityContronller');
const jobTypeController = require('./app/controllers/JobTypeController');
const jobController = require('./app/controllers/JobController');
const companyController = require('./app/controllers/CompanyController');
const notificationController = require('./app/controllers/NotificationController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use('/service',
    [
        userController, provinceController, cityContronller, jobTypeController,
        jobController, companyController, notificationController
    ]
);

var databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/human_resource_db';
mongoose.Promise = global.Promise;
mongoose.connect(databaseUri)
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));
app.get('/', (req, res) => res.render('app'));