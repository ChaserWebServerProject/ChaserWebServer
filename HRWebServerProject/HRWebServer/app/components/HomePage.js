import React, { Component } from 'react';
import axios from 'axios';
import '../../public/content/css/home-page.scss';

import HomePageSearch from 'HomePageSearch';
import Carousel from 'Carousel';
import JobList from 'JobList';
import BreadCrumb from 'BreadCrumb';
import AppAdvertisement from 'AppAdvertisement';
import Follow from 'Follow';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newJobs: [],
            hurryJobs: []
        }
    }

    componentWillMount() {
        this.onLoadJobData();
        this.onCreateBreadCrumData();
    }

    onCreateBreadCrumData() {
        this.liList = [
            { key: 1, title: 'Trang chủ', isActive: true }
        ];
    }

    onLoadJobData() {
        function getTenNewJobs() {
            return axios.get('/service/job/get_ten_new_jobs');
        }

        function getTenHurryJobs() {
            return axios.get('/service/job/get_ten_hurry_jobs');
        }

        const _this = this;

        axios.all([getTenNewJobs(), getTenHurryJobs()])
            .then(axios.spread(function (resNew, resHurry) {
                const newJobs = resNew.data.length ? resNew.data : [];
                const hurryJobs = resHurry.data.length ? resHurry.data : [];
                _this.setState({ newJobs, hurryJobs });
            }))
            .catch(err => console.log(err));
    }

    render() {
        const { newJobs, hurryJobs } = this.state;
        return (
            <div className="homepage-container">
                <Carousel />
                <HomePageSearch />
                <div className="container">
                    <BreadCrumb liList={this.liList} />
                </div>
                <div className="container list-container">
                    <div className="row">
                        <div className="col-md-9 homepage-left-section">
                            <h4 className="section-title">Tuyển gấp</h4>
                            <JobList jobs={hurryJobs} />
                            <div className="form-group homepage-btn-container">
                                <button className="btn btn-sm btn-success">
                                    <i className="fa fa-hand-o-right" aria-hidden="true" /> Xem thêm
                                </button>
                            </div>
                            <h4 className="section-title">Việc làm mới nhất</h4>
                            <JobList jobs={newJobs} />
                            <div className="form-group homepage-btn-container">
                                <button className="btn btn-sm btn-success">
                                    <i className="fa fa-hand-o-right" aria-hidden="true" /> Xem thêm
                                </button>
                            </div>
                            <h4 className="section-title">Tổng hợp ngành nghề</h4>
                            <JobList jobs={newJobs} />
                        </div>
                        <div className="col-md-3 homepage-right-section">
                            <h4 className="section-title"><p>Giới thiệu ứng dụng</p></h4>
                            <div className="item-1">
                                <AppAdvertisement />
                            </div>
                            <div className="item-2">
                                <Follow />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
    }
}