import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';

import '../../public/content/css/result-job-search-page.scss';

import JobList from 'JobList';
import BreadCrumb from 'BreadCrumb';
import Pagination from 'Pagination';

export default class ResultJobSearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageOfItems: [],
            jobs: []
        };

        // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentWillMount() {
        this.onCreateBreadCrumbData();
        this.onGetSearchQueries();
        this.onGetJobData();
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    onGetSearchQueries() {
        const { location } = this.props;
        this.search = location.search;
    }

    onGetJobData() {
        const queries = queryString.parse(this.search);
        $.blockUI();
        axios.post('/service/job/search_jobs_by_url_queries', queries)
            .then(jobs => {
                this.state.jobs = jobs.data.length ? jobs.data : [];
                this.setState(this.state);
            })
            .catch((err) => console.log(err))
            .then(() => $.unblockUI());
    }

    onCreateBreadCrumbData() {
        this.liList = [
            { key: 1, title: 'Tìm kiếm', isActive: true }
        ]
    }

    render() {
        const { jobs, pageOfItems } = this.state;
        return (
            <div className="container result-job-search-container">
                <BreadCrumb liList={this.liList} />
                <div className="result-job-list">
                    <JobList jobs={pageOfItems} />
                </div>
                <div className="page-bar-container">
                    <Pagination items={this.state.jobs} onChangePage={this.onChangePage} />
                </div>
            </div>
        );
    }
}
