import React, { Component } from 'react';
import axios from 'axios';

import { DropDownList } from '@progress/kendo-dropdowns-react-wrapper';
import { Notification } from '@progress/kendo-popups-react-wrapper';

import '../../public/content/css/job-form-modal.scss';
import { formatDateYYMMDD } from '../../util/Util';
export default class JobFormModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            job: {
                jobName: '',
                user: '5a43972c3e241408ecba9573',
                company: '',
                jobType: '',
                city: ''
            },
            job_extend: {
                position: '',
                deadline: formatDateYYMMDD(new Date()),
                salary: '',
                graduation: '',
                workType: '',
                amount: 1,
                genderRequirement: 'NR'
            },

        };
        this.currentTab = 0; // Current tab is set to be the first tab (0)
    }

    componentWillMount() {
        this.onCreateDropdownOptions();
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

    onCreateDropdownOptions() {
        this.provinceDropOptions = {
            filter: "contains",
            dataTextField: "provinceName",
            dataValueField: "_id",
            dataSource: {
                transport: {
                    read: {
                        url: "/service/province/get_all_provinces",
                        dataType: "json",
                        type: 'GET'
                    }
                }
            },
            optionLabel: {
                provinceName: 'Chọn',
                _id: 'none'
            },
            index: 0
        }

        this.cityDropOptions = {
            filter: "contains",
            autoBind: false,
            optionLabel: {
                cityName: 'Chọn',
                _id: 'none'
            },
            dataTextField: "cityName",
            dataValueField: "_id",
            dataSource: {
                transport: {
                    read: {
                        url: "/service/city/get_city_list_by_province_id/0",
                        dataType: "json",
                        type: 'GET'
                    }
                }
            },
            index: 0
        }

        this.companyDropOptions = {
            dataTextField: "companyName",
            dataValueField: "_id",
            dataSource: {
                transport: {
                    read: {
                        url: "/service/company/get_one_company_by_user_id",
                        dataType: "json",
                        type: 'GET'
                    }
                }
            },
            index: 0
        }

        this.jobTypeDropOptions = {
            filter: "contains",
            optionLabel: {
                jobTypeName: 'Chọn',
                _id: 'none',
                attributes: {
                    'style': 'text-align: center'
                },
            },
            dataTextField: "jobTypeName",
            dataValueField: "_id",
            dataSource: {
                transport: {
                    read: {
                        url: "/service/jobtype/get_all_jobtypes",
                        dataType: "json",
                        type: 'GET'
                    }
                }
            },
            index: 0
        }

        this.genderDropOptions = {
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "Không yêu cầu", value: "NR" },
                { text: "Nam", value: "M" },
                { text: "Nữ", value: "F" }
            ],
            index: 0
        }
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

    onShowCities(provinceId) {
        let read = this.cityDrop.dataSource.options.transport.read;
        read.url = '/service/city/get_city_list_by_province_id/' + provinceId;
        this.cityDrop.dataSource.read();
        // console.log(cityDrop.dataSource.data());
    }

    onJobFormSubmit(e) {
        e.preventDefault();
        let _this = this;
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
            .catch(err => console.log(err));
    }

    handleProvinceInputChange(provinceId) {
        // this.state.job.city = '';
        // this.setState(this.state);
        if (provinceId == 'none') {
            provinceId = 0;
        }
        this.onShowCities(provinceId);
    }

    onCompanyDropDataBound(e) {
        var data = e.sender.dataSource.view();
        this.state.job.company = data[0]._id ? data[0]._id : '';
        this.setState(this.state);
    }

    onHideModal() {
        $('#job-form-modal').modal('hide');
    }

    onShowModal() {
        $('#job-form-modal').modal('show');
    }

    render() {
        const { job, job_extend, province, provinces, cities } = this.state;
        return (
            <div className="container job-form-modal-container">
                {/* <!-- Modal --> */}
                <div className="modal fade" id="job-form-modal" tabIndex="" role="dialog" aria-labelledby="center-title" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tuyển dụng</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form id="regForm" onSubmit={this.onJobFormSubmit.bind(this)}>
                                <div className="modal-body">

                                    {/* <!-- One "tab" for each step in the form: --> */}
                                    <div className="form-row justify-content-md-center">
                                        <div className="tab col-md-8 col-offset-2">
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
                                                    dataBound={this.onCompanyDropDataBound.bind(this)}
                                                    widgetRef={widget => this.companyDrop = widget}
                                                    // change={(e) => this.handleJobInputChange({ company: e.sender.value() })}
                                                    {...this.companyDropOptions} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="jobType">Loại hình công việc</label>
                                                <DropDownList
                                                    widgetRef={widget => this.jobTypeDrop = widget}
                                                    change={(e) => this.handleJobInputChange({
                                                        jobType: e.sender.value() == 'none' ? '' : e.sender.value()
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
                                                            city: e.sender.value() == 'none' ? '' : e.sender.value()
                                                        })}
                                                        {...this.cityDropOptions} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab col-md-8 col-md-offset-2">
                                            <h6 className="form-title"><i className="fa fa-pencil" aria-hidden="true"></i> Thông tin liên quan</h6>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="position">Vị trí</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.position}
                                                    onChange={e => this.handleJobExtendInputChange({ position: e.target.value })}
                                                    id="position"
                                                    placeholder="Nhập vị trí tuyển dụng..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="deadline">Hạn nộp</label>
                                                <input
                                                    type="date"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.deadline}
                                                    onChange={e => this.handleJobExtendInputChange({ deadline: e.target.value })}
                                                    id="deadline"
                                                    placeholder="Nhập hạn nộp hồ sơ..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="salary">Lương</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.salary}
                                                    onChange={e => this.handleJobExtendInputChange({ salary: e.target.value })}
                                                    id="salary"
                                                    placeholder="Nhập mức lương..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="graduation">Học vấn</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.graduation}
                                                    onChange={e => this.handleJobExtendInputChange({ graduation: e.target.value })}
                                                    id="graduation"
                                                    placeholder="Nhập yêu cầu học vấn..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="workType">Hình thức</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.workType}
                                                    onChange={e => this.handleJobExtendInputChange({ workType: e.target.value })}
                                                    id="workType"
                                                    placeholder="Nhập hình thức làm việc... (Chính thức)" />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="amount">Số lượng tuyển</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={job_extend.amount}
                                                    onChange={e => this.handleJobExtendInputChange({ amount: e.target.value })}
                                                    id="amount"
                                                    min='1'
                                                    placeholder="Nhập số lượng nhân viên cần tuyển..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label col-form-label-sm" htmlFor="gender">Yêu cầu giới tính</label>
                                                <DropDownList
                                                    widgetRef={widget => this.genderDrop = widget}
                                                    change={(e) => this.handleJobExtendInputChange({ genderRequirement: e.sender.value() })}
                                                    {...this.genderDropOptions} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* button next and pre form */}
                                    <div className="next-pre-container">
                                        <span className="step"></span>
                                        <button type="button" id="prevBtn" onClick={() => this.nextPrev(-1)}><i className="fa fa-arrow-circle-left" aria-hidden="true"></i></button>
                                        <button type="button" id="nextBtn" onClick={() => this.nextPrev(1)}><i className="fa fa-arrow-circle-right" aria-hidden="true"></i></button>
                                        <span className="step"></span>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default btn-sm" data-dismiss="modal">Hủy bỏ</button>
                                    <button type="submit" className="btn btn-primary btn-sm">Lưu</button>
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

    componentDidMount() {
        this.showTab(this.currentTab); // Display the crurrent tab
        this.onAddAttributes();
    }

}
