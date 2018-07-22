import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';

import '../../public/content/css/top-nav.scss';
import Login from '../components/Login';
import{
  tokenName
}from '../variable/Variable';

export default class TopNav extends Component {
  constructor(props){
    super(props);
    this.state=({
      signInDisplay : 'flex',
      signOutDisplay: 'none',
      userManageDisplay: 'none',
      employerDisplay: 'none'
    });
  }

  componentWillMount() {
    this.onSetActionDisplay();
  }

  onSetActionDisplay = ()=>{
    const token = localStorage.getItem(tokenName);
    const _this = this;
    if(token){
      this.state.signInDisplay = 'none';
      this.state.signOutDisplay = 'flex';
      this.state.userManageDisplay = 'flex';
      axios(
        {
          method: 'post',
          url: '/service/user/get_user_identity_by_token',
          headers:{
            Authorization: `Bearer ${token.toString()}`
          }
        })
      .then(result=>{
        if(result.data.userIdentity.role === "employer"){
          _this.state.employerDisplay = 'flex';
          _this.setState(_this.state);
        }else{
          _this.state.employerDisplay = 'none';
          _this.setState(_this.state);
        }
      }).catch(err=>{
        console.log(err);
      })
      this.setState(this.state);
    }else{
      this.state.signInDisplay = 'flex';
      this.state.signOutDisplay = 'none';
      this.state.userManageDisplay = 'none';
      this.state.employerDisplay = 'none';
      this.setState(this.state);
    }
  }

  render() {
    const { signInDisplay, signOutDisplay, userManageDisplay, employerDisplay } = this.state;
    return (
      <div className="top-nav">
        <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
          <Link to="/" className="navbar-brand"><i className="fa fa-handshake-o" aria-hidden="true"></i> Việc Nhanh</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="nav navbar-nav navbar-left">
              <li className="nav-item">
                <NavLink exact to="/" activeClassName="active">Trang chủ</NavLink>
              </li>
              <li className="nav-item" style={{display:employerDisplay}}>
                <NavLink to="/nhatuyendung" activeClassName="active">Nhà tuyển dụng</NavLink>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <img
                    src={require('../../img/local_img/default-avatar.png')} className="img-circle avatar-img" alt="avatar"></img>
                </a>
                <ul className="dropdown-menu">
                  <li style={{display:userManageDisplay}} ><a href="#"><i className="fa fa-user-o" aria-hidden="true"></i> Quản lý tài khoản</a></li>
                  <li style={{display:signOutDisplay}}><a href="#" id="logOut"><i className="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất</a></li>
                  <li style={{display:signInDisplay}}><a href="#" id='login'><i className="fa fa-sign-in" aria-hidden="true"></i> Đăng nhập</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
        <Login ref={ref => this.loginModal = ref} onSetActionDisplay={this.onSetActionDisplay} />
      </div>
    );
  }

  onAddJqueryEvents() {
    $('a').on('click', function () {
      $('.navbar-collapse').removeClass('show');
    });

    var _this = this;

    $('#login').click(function(){
      _this.loginModal.onShowModal();
    });

    $('#logOut').click(function(){
      const token = localStorage.getItem(tokenName);
      if(token){
        localStorage.removeItem(tokenName);
        _this.onSetActionDisplay();
      }
    });
  }

  componentDidMount() {
    this.onAddJqueryEvents();
  }
}