var React = require('react');
var { render } = require('react-dom');
import * as kendo from '@progress/kendo-ui';
import '@progress/kendo-theme-default/dist/all.css';
import { HashRouter as Router } from 'react-router-dom';
// import '@progress/kendo-ui/css/web/kendo.flat.css';

import App from 'App';

render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);