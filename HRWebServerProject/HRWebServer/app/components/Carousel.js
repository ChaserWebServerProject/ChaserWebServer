import React, { Component } from 'react';

import '../../public/content/css/carousel.scss';

export default class Carousel extends Component {
    render() {
        return (
            <div id="home-carousel" className="carousel slide" data-ride="carousel">
                {/* <!-- Indicators --> */}
                <ul className="carousel-indicators">
                    <li data-target="#home-carousel" data-slide-to="0" className="active"></li>
                    <li data-target="#home-carousel" data-slide-to="1"></li>
                    <li data-target="#home-carousel" data-slide-to="2"></li>
                </ul>

                {/* <!-- The slideshow --> */}
                <div className="carousel-inner" id="carousel-inner">
                    <div className="carousel-item active">
                        <img className="carousel-img" src={require('../../img/local_img/panel_1.jpg')} alt="Computer" height="500" />
                    </div>
                    <div className="carousel-item">
                        <img className="carousel-img" src={require('../../img/local_img/panel_2.jpg')} alt="Key Board" height="500" />
                    </div>
                    <div className="carousel-item">
                        <img className="carousel-img" src={require('../../img/local_img/panel_3.jpg')} alt="Civil" height="500" />
                    </div>
                </div>
                <div className="timer-container d-flex justify-content-center">
                    <div className="d-flex timer-animation"><p><i className="fa fa-clock-o" aria-hidden="true"></i></p> : <p id="timer"> </p></div>
                </div>
                {/* <!-- Left and right controls --> */}
                <a className="carousel-control-prev" href="#home-carousel" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </a>
                <a className="carousel-control-next" href="#home-carousel" data-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </a>
            </div>
        );
    }

    componentDidMount() {
        function myTimer() {
            var d = new Date();
            var t = d.toLocaleTimeString();
            document.getElementById("timer").innerHTML = t;
        }
        this.myClock = setInterval(function () { myTimer() }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myClock);
    }
}