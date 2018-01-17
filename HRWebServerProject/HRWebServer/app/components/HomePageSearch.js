import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import axios from 'axios';
import { Link, Redirect, withRouter } from 'react-router-dom';

import '../../public/content/css/home-page-search.scss';

import {
    splitStr,
    joinToStr
} from '../../util/Util';
import {
    provinceDropOptions,
    jobTypeDropOptions
} from '../kendo_ui_options/DropDownListOptions';

class HomePageSearch extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            province: '',
            jobType: '',
            name: ''
        };
        this.state = this.initialState;
        this.history = this.props.history;
    }

    componentWillMount() {
        this.onCreateDropDownOptions();
    }

    onCreateDropDownOptions() {
        //custom options jobtype dropdown
        const jobTypeCustomOptions = { ...jobTypeDropOptions };
        jobTypeCustomOptions.dataValueField = 'orderId';
        jobTypeCustomOptions.optionLabel = {
            jobTypeName: 'Chọn ngành nghề',
            orderId: ''
        }
        this.jobTypeDropOptions = jobTypeCustomOptions;
        //custom options province dropdown
        const provinceCustomOptions = { ...provinceDropOptions };
        provinceCustomOptions.dataValueField = 'orderId';
        provinceCustomOptions.optionLabel = {
            provinceName: 'Chọn nơi làm việc',
            orderId: ''
        }
        this.provinceDropOptions = provinceCustomOptions;
    }

    handleInputChange(newValue) {
        this.setState(state => ({
            ...state,
            ...newValue
        }));
    }

    onSubmitSearchForm(e) {
        e.preventDefault();
        const { jobType, province, name } = this.state;
        const jobTypeText = this.jobTypeDrop.text().trim().toLowerCase();
        const provinceText = this.provinceDrop.text().trim().toLowerCase();
        if (jobType && province && !name.trim()) {
            this.history.push({
                pathname: `/vieclam/việc-làm-${joinToStr(splitStr(jobTypeText, " "), "-")}-tại-${joinToStr(splitStr(provinceText, " "), "-")}`,
                search: `?jobType=${jobType}&province=${province}`,
                state: {

                }
            });
        } else
            if (jobType && !province && !name.trim()) {
                this.history.push({
                    pathname: `/vieclam/việc-làm-${joinToStr(splitStr(jobTypeText, " "), "-")}`,
                    search: `?jobType=${jobType}`,
                    state: {

                    }
                });
            } else
                if (province && !jobType && !name.trim()) {
                    this.history.push({
                        pathname: `/vieclam/việc-làm-tại-${joinToStr(splitStr(provinceText, " "), "-")}`,
                        search: `?province=${province}`,
                        state: {

                        }
                    });
                } else {
                    this.history.push({
                        pathname: '/vieclam/tim-kiem',
                        search: `?name=${encodeURIComponent(name)}&jobType=${jobType}&province=${province}`,
                    });
                }
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
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div className="div-select d-flex">
                                <DropDownList
                                    widgetRef={widget => this.jobTypeDrop = widget}
                                    change={(e) => this.handleInputChange({
                                        jobType: e.sender.value()
                                    })}
                                    className="form-control"
                                    {...this.jobTypeDropOptions} />
                            </div>
                            <div className="div-select d-flex">
                                <DropDownList
                                    className="form-control"
                                    widgetRef={widget => this.provinceDrop = widget}
                                    change={(e) => this.handleInputChange({
                                        province: e.sender.value()
                                    })}
                                    {...this.provinceDropOptions}
                                />
                            </div>
                            <div className="div-btn">
                                <button type="submit"
                                    className="btn btn-success btn-search">
                                    <i className="fa fa-search"></i>
                                </button>
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

export default withRouter(HomePageSearch);
