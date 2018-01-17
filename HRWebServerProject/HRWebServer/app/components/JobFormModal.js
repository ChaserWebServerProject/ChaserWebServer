import React, { Component } from 'react';
import axios from 'axios';
import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import { Notification } from '@progress/kendo-popups-react-wrapper';

import '../../public/content/css/job-form-modal.scss';

import {
    formatDateYYMMDD
} from '../../util/Util';
import {
    getUpdateJobViewModel
} from '../view_models/JobViewModel';
import {
    provinceDropOptions,
    jobTypeDropOptions,
    cityDropOptions,
    companyDropOptions,
    genderDropOptions
} from '../kendo_ui_options/DropDownListOptions';

export default class JobFormModal extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            job: {
                jobName: '',
                user: '5a4e18d07b78182d0855d166',
                jobType: null,
                city: null
            },
            job_extend: {
                position: '',
                deadline: formatDateYYMMDD(new Date()),
                salary: '',
                graduation: '',
                experience: '',
                workType: '',
                amount: 1,
                genderRequirement: 'NR',
                description: '',
                requirement: '',
                benefit: '',
                contact: ''
            },
            jobIdToEdit: null,
            isEdit: false
        };
        this.state = this.initialState;
        this.currentTab = 0; // Current tab is set to be the first tab (0)
    }

    componentWillMount() {
        this.onCreateDropdownOptions();
    }

    onCreateDropdownOptions() {
        this.provinceDropOptions = provinceDropOptions;
        this.cityDropOptions = cityDropOptions;
        this.companyDropOptions = companyDropOptions;
        this.jobTypeDropOptions = jobTypeDropOptions;
        this.genderDropOptions = genderDropOptions;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.jobId) {
            this.onShowJobToEdit(nextProps.jobId);
        } else {
            this.state.isEdit = false;
            this.setState(this.state);
        }
    }

    onShowJobToEdit(jobId) {
        $.blockUI();
        axios.get('/service/job/get_job_by_id/' + jobId)
            .then(res => {
                if (res.data) {
                    const resJob = res.data;
                    const resJobExtend = resJob.jobExtend;
                    const newState = {
                        job: {
                            jobName: resJob.jobName,
                            user: '5a4e0dc781611a3254ab2473',
                            jobType: resJob.jobType._id,
                            city: resJob.city._id
                        },
                        job_extend: {
                            position: resJobExtend.position,
                            deadline: formatDateYYMMDD(new Date(resJobExtend.deadline)),
                            salary: resJobExtend.salary,
                            graduation: resJobExtend.graduation,
                            experience: resJobExtend.experience,
                            workType: resJobExtend.workType,
                            amount: resJobExtend.amount,
                            genderRequirement: resJobExtend.genderRequirement,
                            description: resJobExtend.description,
                            requirement: resJobExtend.requirement,
                            benefit: resJobExtend.benefit,
                            contact: resJobExtend.contact
                        },
                        jobIdToEdit: jobId,
                        isEdit: true
                    }

                    this.state = newState;
                    this.setState(this.state);
                    this.jobTypeDrop.value(resJob.jobType._id);
                    this.provinceDrop.value(resJob.city.province._id);
                    this.onShowCities(resJob.city.province._id);
                    this.genderDrop.value(resJobExtend.genderRequirement);
                }
            })
            .catch(err => console.log(err))
            .then(() => {
                $.unblockUI();
            });
    }

    showTab(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").style.display = "none";
        } else {
            document.getElementById("nextBtn").style.display = "inline";
        }
        //... and run a function that will display the correct step indicator:
        this.fixStepIndicator(n)
    }

    nextPrev(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        // Hide the current tab:
        x[this.currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        this.currentTab = this.currentTab + n;
        this.showTab(this.currentTab);
    }

    fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
    }

    handleJobInputChange(newValue) {
        this.setState(state => ({
            ...state,
            job: {
                ...state.job,
                ...newValue
            }
        }));
    }

    handleJobExtendInputChange(newValue) {
        this.setState(state => ({
            ...state,
            job_extend: {
                ...state.job_extend,
                ...newValue
            }
        }));
    }

    onCreateJob() {
        const _this = this;
        $.blockUI();
        axios.post('/service/job/create_job', {
            job: this.state.job,
            job_extend: this.state.job_extend
        }).then(res => {
            if (res.data.success) {
                _this.props.onRefreshGrid();
                _this.onHideModal();
                bootbox.alert('Thêm thành công');
            } else {
                let errors = res.data.err.errors;
                $.each(errors, function (key, val) {
                    _this.popupNotification.show(val.message, 'error');
                });
            }
        })
            .catch(err => console.log(err))
            .then(() => {
                $.unblockUI();
            });
    }

    onEditJob() {
        const _this = this;
        const jobId = this.state.jobIdToEdit;
        const updateJobContent = getUpdateJobViewModel(this.state);
        $.blockUI();
        axios.put('/service/job/update_job/' + jobId, updateJobContent)
            .then(res => {
                if (res.data.success) {
                    _this.props.onRefreshGrid();
                    _this.onHideModal();
                    bootbox.alert('Sửa thành công');
                } else {
                    let errors = res.data.err.errors;
                    $.each(errors, function (key, val) {
                        _this.popupNotification.show(val.message, 'error');
                    });
                }
            })
            .catch(err => console.log(err))
            .then(() => {
                $.unblockUI();
            });
    }

    onSubmitJobForm(e) {
        e.preventDefault();
        if (this.state.isEdit) {
            this.onEditJob();
        } else {
            this.onCreateJob();
        }
    }

    handleProvinceInputChange(provinceId) {
        this.onResetCityState();
        this.onShowCities(provinceId);
    }

    onResetCityState() {
        this.state.job.city = null;
        this.setState(this.state);
    }

    onShowCities(provinceId) {
        if (provinceId == '') {
            provinceId = null;
        }
        let read = this.cityDrop.dataSource.options.transport.read;
        read.url = `/service/city/get_city_list_by_province_id/${provinceId}`;
        this.cityDrop.dataSource.read();
    }

    onHideModal() {
        $('#job-form-modal').modal('hide');
    }

    onShowModal() {
        $('#job-form-modal').modal('show');
    }

    render() {
        const { job, job_extend, isEdit } = this.state;
        return (
            <div className="container job-form-modal-container">
                {/* <!-- Modal --> */}
                <div className="modal fade" id="job-form-modal" tabIndex="" role="dialog" aria-labelledby="center-title" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {
                                        (() => {
                                            if (isEdit) {
                                                return "Sửa thông tin tuyển dụng"
                                            } else {
                                                return "Đăng tin tuyển dụng"
                                            }
                                        })()
                                    }
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form id="regForm" onSubmit={this.onSubmitJobForm.bind(this)}>
                                <div className="modal-body">

                                    {/* <!-- One "tab" for each step in the form: --> */}
                                    <div className="form-row justify-content-center">
                                        <div className="tab col-md-8">
                                            <h6 className="form-title"><i className="fa fa-pencil" aria-hidden="true"></i> Thông tin cơ bản</h6>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="jobName">Tên công việc</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="jobName"
                                                    value={job.jobName}
                                                    onChange={e => this.handleJobInputChange({ jobName: e.target.value })}
                                                    placeholder="Nhập tên công việc..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="company">Công ty</label>
                                                <DropDownList
                                                    widgetRef={widget => this.companyDrop = widget}
                                                    // change={(e) => this.handleJobInputChange({ company: e.sender.value() })}
                                                    {...this.companyDropOptions} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="jobType">Loại hình công việc</label>
                                                <DropDownList
                                                    widgetRef={widget => this.jobTypeDrop = widget}
                                                    change={(e) => this.handleJobInputChange({
                                                        jobType: e.sender.value() ? e.sender.value() : null
                                                    })}
                                                    {...this.jobTypeDropOptions} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="province">Tỉnh/Thành phố</label>
                                                    <DropDownList
                                                        widgetRef={widget => this.provinceDrop = widget}
                                                        change={(e) => this.handleProvinceInputChange(e.sender.value())}
                                                        {...this.provinceDropOptions} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="city">Quận/Huyện</label>
                                                    <DropDownList
                                                        widgetRef={widget => this.cityDrop = widget}
                                                        change={(e) => this.handleJobInputChange({
                                                            city: e.sender.value() ? e.sender.value() : null
                                                        })}
                                                        {...this.cityDropOptions} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab col-md-12">
                                            <h6 className="form-title"><i className="fa fa-pencil" aria-hidden="true"></i> Thông tin liên quan</h6>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="position">Vị trí</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.position}
                                                        onChange={e => this.handleJobExtendInputChange({ position: e.target.value })}
                                                        id="position"
                                                        placeholder="Nhập vị trí tuyển dụng..." />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="salary">Thu nhập</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.salary}
                                                        onChange={e => this.handleJobExtendInputChange({ salary: e.target.value })}
                                                        id="salary"
                                                        placeholder="Nhập mức lương..." />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="graduation">Học vấn</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.graduation}
                                                        onChange={e => this.handleJobExtendInputChange({ graduation: e.target.value })}
                                                        id="graduation"
                                                        placeholder="Nhập yêu cầu học vấn..." />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="experience">Kinh nghiệm</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.experience}
                                                        onChange={e => this.handleJobExtendInputChange({ experience: e.target.value })}
                                                        id="experience"
                                                        placeholder="Nhập yêu cầu kinh nghiệm..." />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="workType">Hình thức</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.workType}
                                                        onChange={e => this.handleJobExtendInputChange({ workType: e.target.value })}
                                                        id="workType"
                                                        placeholder="Nhập hình thức làm việc... (chính thức)" />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="gender">Yêu cầu giới tính</label>
                                                    <DropDownList
                                                        widgetRef={widget => this.genderDrop = widget}
                                                        change={(e) => this.handleJobExtendInputChange({ genderRequirement: e.sender.value() })}
                                                        {...this.genderDropOptions} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="amount">Số lượng tuyển</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.amount}
                                                        onChange={e => this.handleJobExtendInputChange({ amount: e.target.value })}
                                                        id="amount"
                                                        min='1'
                                                        placeholder="Nhập số lượng..." />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="col-form-label col-form-label-sm" htmlFor="deadline">Hạn nộp</label>
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        value={job_extend.deadline}
                                                        onChange={e => this.handleJobExtendInputChange({ deadline: e.target.value })}
                                                        id="deadline"
                                                        placeholder="Nhập hạn nộp hồ sơ..." />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="description">Mô tả công việc</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.description}
                                                    onChange={e => this.handleJobExtendInputChange({ description: e.target.value })}
                                                    id="description"
                                                    maxLength="4000"
                                                    rows="4"
                                                    placeholder={"Nhập mô tả công việc... \n      - ... \n      - ... \n      - ...`"} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="requirement">Yêu cầu công việc</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.requirement}
                                                    onChange={e => this.handleJobExtendInputChange({ requirement: e.target.value })}
                                                    id="requirement"
                                                    maxLength="4000"
                                                    rows="4"
                                                    placeholder={"Nhập yêu cầu công việc... \n      - ... \n      - ... \n      - ...`"} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="benefit">Quyền lợi</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.benefit}
                                                    onChange={e => this.handleJobExtendInputChange({ benefit: e.target.value })}
                                                    id="benefit"
                                                    maxLength="4000"
                                                    rows="4"
                                                    placeholder={"Nhập quyền lợi hợp tác... \n      - ... \n      - ... \n      - ..."} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="contact">Thông tin liên hệ</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.contact}
                                                    onChange={e => this.handleJobExtendInputChange({ contact: e.target.value })}
                                                    id="contact"
                                                    maxLength="4000"
                                                    rows="4"
                                                    placeholder={"Nhập thông tin liên hệ... \n      - ... \n      - ... \n      - ...`"} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* button next and pre form */}
                                    <div className="next-pre-container d-flex justify-content-center align-items-center">
                                        <span className="step"></span>
                                        <button type="button" id="prevBtn" onClick={() => this.nextPrev(-1)}><i className="fa fa-arrow-circle-left" aria-hidden="true"></i></button>
                                        <button type="button" id="nextBtn" onClick={() => this.nextPrev(1)}><i className="fa fa-arrow-circle-right" aria-hidden="true"></i></button>
                                        <span className="step"></span>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default btn-sm" data-dismiss="modal">Hủy bỏ</button>
                                    {
                                        (() => {
                                            if (isEdit) {
                                                return <button type="submit" className="btn btn-primary btn-sm">Lưu</button>
                                            } else {
                                                return <button type="submit" className="btn btn-primary btn-sm">Thêm</button>
                                            }
                                        })()
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Notification widgetRef={(widget) =>
                    this.popupNotification = widget}
                />
            </div >
        );
    }

    onAddAttributes() {
        $('.k-dropdown').addClass('form-control form-control-sm');
    }

    onResetState() {
        this.state = this.initialState;
        this.setState(this.state);
    }

    onResetDropdownData() {
        this.provinceDrop.value('');
        this.jobTypeDrop.value('');
        this.genderDrop.value('NR');
        this.cityDrop.value('');
    }

    onResetCityDropData() {
        this.onShowCities('');
    }

    onPrevTabWhenModalShow() {
        if (this.currentTab == 1) {
            this.nextPrev(-1);
        }
    }

    onAddJqueryEvents() {
        let _this = this;
        $('#job-form-modal').on('show.bs.modal', function () {
            _this.onResetDropdownData();
            _this.onResetState();
            _this.onPrevTabWhenModalShow();
            _this.onResetCityDropData();
        });
    }

    onBindCityDropDataSourceChange() {
        this.cityDrop.dataSource.bind("change", this.onCityDropDataSourceChange.bind(this));
        this.cityDrop.dataSource.fetch();
    }

    onCityDropDataSourceChange() {
        if (this.state.job.city) {
            this.cityDrop.value(this.state.job.city);
        }
    }

    componentDidMount() {
        this.showTab(this.currentTab); // Display the crurrent tab
        this.onAddAttributes();
        this.onAddJqueryEvents();
        this.onBindCityDropDataSourceChange();
    }

    componentWillUnmount() {
        this.onHideModal();
    }

}
