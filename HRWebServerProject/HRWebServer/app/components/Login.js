import React, { Component } from 'react';
import axios from 'axios';

import '../../public/content/css/login.scss';
import{
    tokenName
}from '../variable/Variable';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state =({

        });
    }

    onHideModal() {
        $('#loginModal').modal('hide');
    }

    onShowModal() {
        $('#loginModal').modal('show');
    }

    render() {
        return (
            // <!-- Modal -->
            <div className="modal fade" id="loginModal" role="dialog">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header login-modal">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Đăng nhập</h4>
                        </div>
                        <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-user-circle-o"></i></span>
                                    <input id="email" type="text" className="form-control" name="email" placeholder="Tài khoản..." />
                                </div>
                            </div>
                            <div classNameName="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-key"></i></span>
                                    <input id="password" type="password" className="form-control" name="password" placeholder="Mật khẩu..." />
                                </div>
                            </div>
                        </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="login-submit" className="btn btn-sm btn-success" >Hoàn tất</button>
                            <button type="button" className="btn btn-sm btn-default" data-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onAddJqueryEvents() {
        const _this = this;

        $('#login-submit').click(function(){
            const userName = $('#email').val();
            const passwordHash = $('#password').val();
            if ( passwordHash === '' &&  userName === '') {
                bootbox.alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            }else{
                $.blockUI(); 
                axios.post('/service/user/login',{
                    userName: userName,
                    passwordHash: passwordHash
                }).then(res => {
                    if (res.data.success) {
                        localStorage.setItem(tokenName, res.data.token);
                        _this.props.onSetActionDisplay();
                        _this.onHideModal();
                        // bootbox.alert('Thành công!');
                    } else {
                        bootbox.alert('Tài khoản hoặc mật khẩu không chính xác!');
                    }
                })
                    .catch(err => console.log(err))
                    .then(() => {
                        $.unblockUI();
                    });
            }
        });
    }

    componentDidMount() {
        this.onAddJqueryEvents();
    }
}
