
const provinceDropOptions = {
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
        _id: ''
    },
    index: 0
}

const jobTypeDropOptions = {
    filter: "contains",
    optionLabel: {
        jobTypeName: 'Chọn',
        _id: '',
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

const cityDropOptions = {
    filter: "contains",
    autoBind: false,
    optionLabel: {
        cityName: 'Chọn',
        _id: ''
    },
    dataTextField: "cityName",
    dataValueField: "_id",
    dataSource: {
        transport: {
            read: {
                url: '/service/city/get_city_list_by_province_id/null',
                dataType: "json",
                type: 'GET'
            }
        }
    },
    index: 0
}

const companyDropOptions = {
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

const genderDropOptions = {
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
        { text: "Không yêu cầu", value: "NR" },
        { text: "Nam", value: "M" },
        { text: "Nữ", value: "F" }
    ],
    index: 0
}

module.exports = {
    provinceDropOptions,
    jobTypeDropOptions,
    cityDropOptions,
    companyDropOptions,
    genderDropOptions
};
