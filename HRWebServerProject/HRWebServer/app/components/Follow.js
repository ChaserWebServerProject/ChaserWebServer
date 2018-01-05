import React, { Component } from 'react';

import '../../public/content/css/follow.scss';

export default class Follow extends Component {
    render() {
        return (
            <div className="follow-container">
                <div className="top-section">
                    <img src={require('../../img/local_img/panel_1.jpg')} alt="background" className="background-img" />
                    <div className="bottom-left">
                        <button className="btn btn-default"><i style={{ color: 'blue' }} className="fa fa-facebook-square" aria-hidden="true"></i> Like Page</button>
                    </div>
                    <div className="top-left">
                        <a href="#" className="page-avatar-container">
                            <img className="page-avatar" src={require('../../img/local_img/panel_2.jpg')} alt="background" />
                        </a>
                        <div className="form-group page-info">
                            <a className="page-name" href="#">Việc Nhanh</a>
                            <p className="page-like">Triệu likes</p>
                        </div>
                    </div>
                    {/* <div className="top-right">Top Right</div> */}
                    <div className="bottom-right">
                        <button className="btn btn-default"><i style={{ color: '#555555' }} className="fa fa-share-alt" aria-hidden="true"></i> Share</button>
                    </div>
                    {/* <div className="centered">Centered</div> */}
                </div>
            </div>
        );
    }
}
