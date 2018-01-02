import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import '@progress/kendo-ui/css/web/kendo.flat.css';
import { Switch, Redirect } from 'react-router'
import HomePage from 'HomePage';
import Employer from 'Employer'
import TopNav from 'TopNav';
import Footer from 'Footer';
import Test1 from '../components/Test1';

import '../../public/content/css/app.scss';

export default class App extends Component {
    render() {
        return (
            <div className="app-container">
                <TopNav />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/employer" component={Employer} />
                    <Route exact path="*" component={Test1} />
                </Switch>
                <Footer />
            </div>
        );
    }
}
