import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import axios from 'axios';

import '../../public/content/css/home-page-search.scss';

import { provinceDropOptions, jobTypeDropOptions } from '../kendo_ui_options/DropDownListOptions';

export default class HomePageSearch extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            province: null,
            jobType: null,
            seacrhContent: ''
        };
        this.state = this.initialState;
    }

    componentWillMount() {
        this.onCreateDropDownOptions();
    }

    onCreateDropDownOptions() {
        this.jobTypeDropOptions = jobTypeDropOptions;
        this.provinceDropOptions = provinceDropOptions;
    }

    handleInputChange(newValue) {
        this.setState(state => ({
            ...state,
            ...newValue
        }));
    }

    onSubmitSearchForm(e){
        e.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <div className="search-widget">
                <div className="main-content">
                    <form onSubmit={this.onSubmitSearchForm.bind(this)}>
                        <h5 className="title">
                            <i style={{ fontSize: 15, padding: 5 }} className="fa fa-quote-left" aria-hidden="true" />Trải qua một việc thêm một phần trí khôn<i style={{ fontSize: 15, padding: 5 }} className="fa fa-quote-right" aria-hidden="true" />
                        </h5>
                        <div className="form-row search-content">
                            <div className="div-input">
                                <input
                                    className="form-control"
                                    placeholder="Nhập công việc, vị trí, ..."
                                    onChange={(e) => this.handleInputChange({
                                        seacrhContent: e.target.value
                                    })}
                                />
                            </div>
                            <div className="div-select d-flex">
                                <DropDownList
                                    widgetRef={widget => this.jobTypeDrop = widget}
                                    change={(e) => this.handleInputChange({
                                        jobType: e.sender.value() ? e.sender.value() : null
                                    })}
                                    className="form-control"
                                    {...this.jobTypeDropOptions} />
                                {/* <select className="form-control" /> */}
                            </div>
                            <div className="div-select d-flex">
                                <DropDownList
                                    className="form-control"
                                    widgetRef={widget => this.provinceDrop = widget}
                                    change={(e) => this.handleInputChange({
                                        province: e.sender.value() ? e.sender.value() : null
                                    })}
                                    {...this.provinceDropOptions}
                                />
                                {/* <select className="form-control" /> */}
                            </div>
                            <div className="div-btn">
                                <button type="submit" className="btn btn-success btn-search"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    onAddAttributes() {
        $('.k-dropdown').addClass('form-control form-control-sm');
    }

    componentDidMount() {
        this.onAddAttributes();
    }
}