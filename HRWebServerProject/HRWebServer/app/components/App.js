import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from 'HomePage';
import EmployerPage from 'EmployerPage'
import TopNav from 'TopNav';
import Footer from 'Footer';
import ImageBox from 'ImageBox';
import Error404Page from 'Error404Page';
import ResultJobSearchPage from 'ResultJobSearchPage';
import JobDetailPage from 'JobDetailPage';

import '../../public/content/css/app.scss';

export default class App extends Component {
    render() {
        return (
            <div className="app-container">
                <TopNav />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path='/vieclam/:content' component={ResultJobSearchPage} />
                    <Route exact path="/nhatuyendung" component={EmployerPage} />
                    <Route exact path="/chitietcongviec/:id" component={JobDetailPage} />
                    <Route path="*" component={Error404Page} />
                </Switch>
                <ImageBox />
                <Footer />
            </div>
        );
    }

    componentDidMount() {
    }
}
