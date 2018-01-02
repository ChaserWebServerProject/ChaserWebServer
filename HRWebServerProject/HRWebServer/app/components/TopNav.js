import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import '../../public/content/css/top-nav.scss';

export default class TopNav extends Component {
  render() {
    return (
      <div className="top-nav">
        <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
          <Link to="/" className="navbar-brand"><i className="fa fa-handshake-o" aria-hidden="true"></i> Nhân Sự</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="nav navbar-nav navbar-left">
              <li className="nav-item">
                <NavLink exact to="/" activeClassName="active">Trang chủ</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/employer" activeClassName="active">Nhà tuyển dụng</NavLink>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <img
                    src={require('../../img/local_img/default-avatar.png')} className="img-circle avatar-img" alt="avatar"></img>
                </a>
                <ul className="dropdown-menu">
                  <li><a href="#"><i className="fa fa-user-o" aria-hidden="true"></i> Quản lý tài khoản</a></li>
                  <li><a href="#"><i className="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}