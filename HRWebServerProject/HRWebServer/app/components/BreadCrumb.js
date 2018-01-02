import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../public/content/css/bread-crumb.scss';

export default class BreadCrumb extends Component {
    render() {
        const { liList } = this.props;
        return (
            <ol className="breadcrumb-arrow">
                <li><Link to="/"><i style={{ padding: 5 }} className="fa fa-home" aria-hidden="true" /></Link></li>
                {
                    liList.map(item => {
                        return <li key={item.key} className={item.isActive ? 'active' : ''}><span>{item.title}</span></li>;
                    })
                }
            </ol>
        );
    }
}