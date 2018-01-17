import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';

import '../../public/content/css/job-detail-page.scss';

import BreadCrumb from 'BreadCrumb';

import {
    formatDate,
    splitStr
} from '../../util/Util';

export default class JobDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: null
        }
    }

    componentWillMount() {
        this.onCreateBreadCrumbData();
        this.onGetSearchQueries();
        this.onIncreaseViewsOfJob();
    }

    onCreateBreadCrumbData() {
        this.liList = [
            { key: 1, title: 'Chi tiết công việc', isActive: true }
        ]
    }

    onGetSearchQueries() {
        const { location } = this.props;
        this.search = location.search;
    }

    onIncreaseViewsOfJob() {
        const queries = queryString.parse(this.search);
        const { jobId } = queries;
        axios.put('/service/job/increase_views/' + jobId)
            .then((res) => {
                if (res.data.success) {
                    this.onGetJobData(jobId);
                }
            })
            .catch((err) => console.log(err))
            .then(() => $.unblockUI());
    }

    onGetJobData(jobId) {
        $.blockUI();
        axios.get('/service/job/get_job_by_id/' + jobId)
            .then(job => {
                this.state.job = job.data ? job.data : {};
                this.setState(this.state);
            })
            .catch((err) => console.log(err))
            .then(() => $.unblockUI());
    }

    render() {
        const { job } = this.state;
        if (!job) {
            return (
                <h1 style={{ paddingTop: 57 }}>Đang tải...</h1>
            );
        } else {
            let genderRequire = job.jobExtend.genderRequirement;
            switch (genderRequire) {
                case 'F': {
                    genderRequire = 'Nữ';
                    break;
                }
                case 'NR': {
                    genderRequire = 'Không yêu cầu';
                    break;
                }
                case 'M': {
                    genderRequire = 'Nam';
                    break;
                }
                default: break;
            }
            const jobExtend = job.jobExtend;
            return (
                <div className="container job-detail-page-container">
                    <BreadCrumb liList={this.liList} />
                    <div className="top-section">
                        <h5 className="job-name"><strong>{job.jobName}</strong></h5>
                        <h6 className="company-name"><strong>{job.user.company.companyName}</strong></h6>
                        <div className="time-view-container d-flex justify-content-between">
                            <p className="deadline">
                                <i className="fa fa-clock-o" aria-hidden="true"></i> <strong>Hạn nộp hồ sơ:</strong> {formatDate(new Date(jobExtend.deadline))}</p>
                            <p><i className="fa fa-eye" aria-hidden="true"></i> <strong>Lượt xem:</strong> {job.views}</p>
                        </div>
                    </div>
                    <div className="middle-section">
                        <div className="form-row">
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex  justify-content-center"><i className="fa fa-usd" aria-hidden="true"></i></p>
                                <p> <strong>Mức lương</strong>: {jobExtend.salary}</p>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-map-marker" aria-hidden="true"></i></p>
                                <p> <strong>Địa điểm làm việc</strong>: {job.city.province.provinceName}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-signal" aria-hidden="true"></i></p>
                                <p> <strong>Kinh nghiệm</strong>: {jobExtend.experience}</p>
                            </div>
                            <div className="col-sm-6 d-flex ">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-briefcase" aria-hidden="true"></i></p>
                                <p> <strong>Chức vụ</strong>: {jobExtend.position}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-graduation-cap" aria-hidden="true"></i></p>
                                <p> <strong>Yêu cầu bằng cấp</strong>: {jobExtend.graduation}</p>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-laptop" aria-hidden="true"></i></p>
                                <p> <strong>Hình thức làm việc</strong>: {jobExtend.workType}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"><i className="fa fa-user-o" aria-hidden="true"></i></p>
                                <p> <strong>Số lượng cần tuyển</strong>: {jobExtend.amount}</p>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <p className="icon-container d-flex justify-content-center"> <i className="fa fa-intersex"></i></p>
                                <p> <strong>Yêu cầu giới tính</strong>: {genderRequire}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-section">
                        <div className="bot-item">
                            <h6><strong>Mô tả công việc</strong></h6>
                            <div className="content">
                                {
                                    splitStr(jobExtend.description, "\n").map((item, index) => {
                                        return <p key={index}>{item}</p>
                                    })
                                }
                            </div>
                        </div>

                        <div className="bot-item">
                            <h6><strong>Yêu cầu công việc</strong></h6>
                            <div className="content">
                                {
                                    splitStr(jobExtend.requirement, "\n").map((item, index) => {
                                        return <p key={index}>{item}</p>
                                    })
                                }
                            </div>
                        </div>

                        <div className="bot-item">
                            <h6><strong>Quyền lợi</strong></h6>
                            <div className="content">
                                {
                                    splitStr(jobExtend.benefit, "\n").map((item, index) => {
                                        return <p key={index}>{item}</p>
                                    })
                                }
                            </div>
                        </div>

                        <div className="bot-item">
                            <h6><strong>Thông tin liên hệ</strong></h6>
                            <div className="content">
                                {
                                    splitStr(jobExtend.contact, "\n").map((item, index) => {
                                        return <p key={index}>{item}</p>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
