import React, { Component } from 'react';

import '../../public/content/css/job-list.scss';
import { formatDate } from '../../util/Util';

export default class JobList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.jobs !== this.props.jobs) {
            this.setState({ jobs: nextProps.jobs ? nextProps.jobs : [] });
        }
    }

    render() {
        const { jobs } = this.state;
        return (
            <div className="col-xs-12 job-list-content">
                <div className="row job-header">
                    <div className="col-xs-12 col-sm-6">
                        <p>Vị trí tuyển dụng</p>
                    </div>
                    <div className="col-xs-4 col-sm-2">
                        <p className="text-center">Mức lương</p>
                    </div>
                    <div className="col-xs-4 col-sm-2">
                        <p className="text-center">Khu vực</p>
                    </div>
                    <div className="col-xs-4 col-sm-2">
                        <p className="text-center">Hạn nộp</p>
                    </div>
                </div>
                {
                    jobs.map((job, index) =>
                        (<div key={index} id={job._id} className="job-item-container">
                            <hr />
                            <div className="row job-item">
                                <div className="col-xs-12 col-sm-6 job-title">
                                    <p><i className="fa fa-suitcase" aria-hidden="true"></i> {job.jobExtend.position}</p>
                                    <p><a href={"#" + job.user.company._id} className="company-name"><i className="fa fa-building" aria-hidden="true"></i> <strong>{job.user.company.companyName}</strong></a></p>
                                </div>
                                <div className="col-xs-4 col-sm-2">
                                    <p className="text-center"><i className="fa fa-usd" aria-hidden="true"></i> {job.jobExtend.salary}</p>
                                </div>
                                <div className="col-xs-4 col-sm-2">
                                    <p className="text-center"><i className="fa fa-map-marker" aria-hidden="true"></i> {job.city.province.provinceName}</p>
                                </div>
                                <div className="col-xs-4 col-sm-2">
                                    <p className="text-center"><i className="fa fa-calendar" aria-hidden="true"></i> {formatDate(new Date(job.jobExtend.deadline))}</p>
                                </div>
                            </div>
                        </div>)
                    )
                }
            </div>
        );
    }
}