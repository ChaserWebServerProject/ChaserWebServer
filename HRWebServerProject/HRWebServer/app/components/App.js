import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Switch, Redirect } from 'react-router'

import HomePage from 'HomePage';
import Employer from 'Employer'
import TopNav from 'TopNav';
import Footer from 'Footer';
import ImageBox from 'ImageBox';
import Error404Page from 'Error404Page';

import '../../public/content/css/app.scss';

export default class App extends Component {
    render() {
        return (
            <div className="app-container">
                <TopNav />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/employer" component={Employer} />
                    <Route exact path="*" component={Error404Page} />
                </Switch>
                <ImageBox />
                <Footer />
            </div>
        );
    }

    componentDidMount() {
    }
}
