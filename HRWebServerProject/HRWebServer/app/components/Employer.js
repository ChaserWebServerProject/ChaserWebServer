import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import axios from 'axios';

import BreadCrumb from 'BreadCrumb';
import JobFormModal from 'JobFormModal';
import '../../public/content/css/employer.scss';


export default class Employer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        this.onCreateBreadCrumbData();
        this.onCreateGridOptions();
    }

    onCreateBreadCrumbData() {
        this.liList = [
            { key: 1, title: 'Nhà tuyển dụng', isActive: true }
        ];
    }

    onCreateGridOptions() {
        this.gridOptions = {
            dataSource: {
                transport: {
                    read: {
                        url: "/service/job/get_all_jobs",
                        dataType: "json",
                        type: 'GET'
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                },
                schema: {
                    model: {
                        "_id": "_id",
                        fields: {
                            "_id": { type: "number" },
                            "jobName": { type: 'string' },
                            "jobType.jobTypeName": { type: 'string' },
                            "city.cityName": { type: 'string' },
                            "city.province.provinceName": { type: 'string' },
                            "dateCreated": { type: 'date' }
                        }
                    }
                },
                pageSize: 20
            },
            toolbar: `
                <div class="form-row d-flex">
                    <div class="col-sm-3 d-flex">
                        <a role="button" 
                        id="job-create-button"
                        style="border-radius:0.25rem;display:initial;" 
                        class="k-button" >
                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        </a>
                        <a role="button" 
                        id="job-grid-refresh-button"
                        style="border-radius:0.25rem;display:initial;" 
                        class="k-button" >
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div class="col-sm-9">
                        <input id="job-search-box" type="text" style="height:90%!important;float:right;"
                         class="k-input k-textbox" placeholder="Tìm kiếm...">
                    </div>
                </div>
            `,
            height: 550,
            filterable: false,
            sortable: true,
            pageable: true,
            resizable: true,
            columns: [
                {
                    title: 'No.',
                    template: '<span class="row-number"></span>',
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: '_id',
                    title: 'Mã công việc',
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: "jobName",
                    title: "Tên công việc",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: "jobType.jobTypeName",
                    title: "Loại công việc",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: "city.cityName",
                    title: "Quận/Huyện",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: "city.province.provinceName",
                    title: "Tỉnh/Thành phố",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    field: "dateCreated",
                    title: "Ngày tạo",
                    format: "{0:dd/MM/yyyy}",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                },
                {
                    command: [
                        {
                            name: "onDetail",
                            click: this.onDetail.bind(this),
                            template: '<a style="margin:2px;padding:0 0.5rem;" class="btn btn-sm btn-info k-grid-onDetail"><i style="color:white;" class="fa fa-info" aria-hidden="true"></i></a>'
                        },
                        {
                            name: "onDelete",
                            click: this.onDelete.bind(this),
                            template: '<a style="margin:2px;padding:0 0.3rem;" class="btn btn-sm btn-danger k-grid-onDelete"><i style="color:white;" class="fa fa-trash-o" aria-hidden="true"></i></a>'
                        }
                    ],
                    title: "",
                    attributes: {
                        'style': 'text-align: center'
                    },
                    headerAttributes: {
                        'style': 'text-align: center'
                    }
                }
            ]
        };
    }

    onDetail(e) {
        let tr = $(e.currentTarget).closest('tr');
        let dataItem = this.grid.dataItem(tr);
        // axios.put('/service/job', {
        //     params: {
        //         id: dataItem.id
        //     }
        // }).then(res => {

        // })
        //     .catch(err => console.log(err));
    }

    onDelete(e) {
        let tr = $(e.currentTarget).closest('tr');
        let dataItem = this.grid.dataItem(tr);
        let _this = this;
        bootbox.confirm({
            message: "Công việc bạn chọn sẽ bị xóa. Bạn thật sự chắc chắn?",
            buttons: {
                confirm: {
                    label: 'Xóa',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'Hủy',
                    className: 'btn-gray'
                }
            },
            callback: function (result) {
                if (result) {
                    $.blockUI();
                    axios.delete('/service/job/delete_job/' + dataItem.id).then(res => {
                        if (res.data.success) {
                            this.onRefreshGrid();
                            bootbox.alert('Xóa thành công!');
                        } else {
                            bootbox.alert('Không thành công! Hãy chọn công việc cần xóa.');
                        }
                    })
                        .catch(err => console.log(err))
                        .then(() => {
                            $.unblockUI();
                        });
                }
            }
        });
    }

    onDataBound(e) {
        let grid = e.sender;
        let totalRows = grid.items();
        $.each(totalRows, function () {
            var index = $(this).index() + 1
                + (grid.dataSource.pageSize() * (grid.dataSource.page() - 1));
            var rowLabel = $(this).find(".row-number");
            $(rowLabel).html(index);
        });
    }

    onRefreshGrid() {
        this.grid.dataSource.read();
        this.grid.dataSource.filter({});
        $('#job-search-box').val('');
    }

    render() {
        // const { } = this.state;
        return (
            <div className='container employer-container'>
                <BreadCrumb liList={this.liList} />
                <Grid
                    widgetRef={(widget) => this.grid = widget}
                    dataBound={this.onDataBound.bind(this)}
                    {...this.gridOptions}
                />
                <JobFormModal ref={ref => this.jobFormModal = ref} onRefreshGrid={this.onRefreshGrid.bind(this)} />
            </div>
        );
    }

    onAddJqueryEvents() {
        let _this = this;

        $('#job-create-button').on('click', function () {
            _this.jobFormModal.onShowModal();
        });

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $("#job-search-box").on('input', function (e) {
            var columns = _this.grid.columns;
            var filter = { logic: 'or', filters: [] };
            columns.forEach(function (x) {
                if (x.field) {
                    var type = _this.grid.dataSource.options.schema.model.fields[x.field];
                    if (type) {
                        type = type.type;
                        if (type == 'string') {
                            filter.filters.push({
                                field: x.field,
                                operator: 'contains',
                                value: e.target.value
                            })
                        }
                        else if (type == 'number') {
                            if (isNumeric(e.target.value)) {
                                filter.filters.push({
                                    field: x.field,
                                    operator: 'eq',
                                    value: e.target.value
                                });
                            }

                        } else if (type == 'date') {
                            var data = _this.grid.dataSource.data();
                            for (var i = 0; i < data.length; i++) {
                                var dateStr = kendo.format(x.format, data[i][x.field]);
                                // change to includes() if you wish to filter that way https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
                                if (dateStr.startsWith(e.target.value)) {
                                    filter.filters.push({
                                        field: x.field,
                                        operator: 'eq',
                                        value: data[i][x.field]
                                    })
                                }
                            }
                        }
                    }
                }
            });
            _this.grid.dataSource.filter(filter);
        });

        $('#job-grid-refresh-button').on('click', function () {
            _this.onRefreshGrid();
        });

    }

    componentDidMount() {
        this.onAddJqueryEvents();
    }
}