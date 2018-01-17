import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../public/content/css/error404page.scss';

export default class Error404Page extends Component {
    render() {
        return (
            <div className="err404page_container">
                <div className="top-bar-agile">
                    <div className="logo-agileits">
                        <Link to="/"><img src={require("../../img/local_img/exit_logo.png")} alt="" /></Link>
                    </div>
                    <div className="nav-agileinfo">
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/nhatuyendung">Nhà tuyển dụng</Link></li>
                            {/* <li><a href="#">Trang chủ</a></li>
                            <li><a href="#">Nhà tuyển dụng</a></li> */}
                            {/* <li><a href="#">Work</a></li>
                            <li><a href="#">Contact</a></li> */}
                        </ul>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="content-w3">
                    <h1>404</h1>
                    <h2>Không tìm thấy</h2>
                    <p>Trang bạn đang tìm kiếm đã bị xóa, đã đổi tên hoặc tạm thời không có</p>
                </div>
                <div className="footer-w3ls">
                    <p> &copy; Copyright {(new Date).getFullYear()} Việc Nhanh. Bản quyền | Thiết kế bởi <a style={{ cursor: 'pointer' }}>DP Team</a></p>
                </div>
            </div>
        );
    }

    onAddJqueryEvents() {
        document.getElementsByClassName('top-nav')[0].style.display = "none";
        document.getElementsByClassName('footer')[0].style.display = "none";
    }

    onRemoveJqueryEvents() {
        document.getElementsByClassName('top-nav')[0].style.display = "block";
        document.getElementsByClassName('footer')[0].style.display = "block";
    }

    componentDidMount() {
        this.onAddJqueryEvents();
    }

    componentWillUnmount() {
        this.onRemoveJqueryEvents();
    }
}
