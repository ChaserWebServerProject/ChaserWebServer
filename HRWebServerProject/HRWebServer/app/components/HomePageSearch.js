import React, { Component } from 'react';

import '../../public/content/css/home-page-search.scss';


export default class HomePageSearch extends Component {
    render() {
        return (
            <div className="search-widget">
                <div className="main-content">
                    <form>
                        <h5 className="title">
                            <i style={{ fontSize: 15, padding: 5 }} className="fa fa-quote-left" aria-hidden="true" />Trải qua một việc thêm một phần trí khôn<i style={{ fontSize: 15, padding: 5 }} className="fa fa-quote-right" aria-hidden="true" />
                        </h5>
                        <div className="form-row search-content">
                            <div className="div-input">
                                <input className="form-control" placeholder="Nhập công việc, vị trí, ..." />
                            </div>
                            <div className="div-select">
                                <select className="form-control" />
                            </div>
                            <div className="div-select">
                                <select className="form-control" />
                            </div>
                            <div className="div-btn">
                                <button className="btn btn-success btn-search"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}