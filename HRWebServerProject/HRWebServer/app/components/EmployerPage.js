import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import axios from 'axios';

import BreadCrumb from 'BreadCrumb';
import JobFormModal from 'JobFormModal';
import JobGrid from 'JobGrid';

import '../../public/content/css/employer-page.scss';


export default class EmployerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        this.onCreateBreadCrumbData();
    }

    onCreateBreadCrumbData() {
        this.liList = [
            { key: 1, title: 'Nhà tuyển dụng', isActive: true }
        ];
    }

    render() {
        // const { } = this.state;
        return (
            <div className='container employer-container'>
                <BreadCrumb liList={this.liList} />
                <div className="grid-container">
                    <JobGrid ref={ref => this.jobGrid = ref} />
                </div>
            </div>
        );
    }
}