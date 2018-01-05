import React, { Component } from 'react';

import '../../public/content/css/footer.scss';

export default class Footer extends Component {
    render() {
        return (
            <div className="row footer">
                <p
                    className="">
                    &copy; Copyright {(new Date).getFullYear()} Việc Nhanh. Bản quyền | Thiết kế bởi
                <a style={{ cursor: 'pointer', paddingLeft: 5 }}>DP Team</a></p>
            </div>
        );
    }
}