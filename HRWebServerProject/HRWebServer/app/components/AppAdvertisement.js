import React, { Component } from 'react';

import '../../public/content/css/app-advertisement.scss';

export default class AppAdvertisement extends Component {

    constructor(props) {
        super(props);
        this.slideIndex = 1;
    }

    componentDidMount() {
        this.showSlides(this.slideIndex);
        // const interval = setInterval(() => this.showSlides(this.slideIndex++), 10000);
    }

    // Next/previous controls
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    // Thumbnail image controls
    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }

    showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("demo");
        var captionText = document.getElementById("caption");
        if (n > slides.length) { this.slideIndex = 1 }
        if (n < 1) { this.slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.slideIndex - 1].style.display = "block";
        dots[this.slideIndex - 1].className += " active";
        captionText.innerHTML = dots[this.slideIndex - 1].alt;
    }

    render() {
        return (
            <div className="advertise-container">
                {/* <!-- Container for the image gallery --> */}
                <div className="container advertise-content">
                    {/* <!-- Full-width images with number text --> */}
                    <div className="mySlides">
                        <div className="numbertext"><p>1/6</p></div>
                        <img src={require('../../img/local_img/advertise_1.png')} />
                    </div>
                    <div className="mySlides">
                        <div className="numbertext"><p>2/6</p></div>
                        <img src={require('../../img/local_img/advertise_2.png')} />
                    </div>
                    <div className="mySlides">
                        <div className="numbertext"><p>3/6</p></div>
                        <img src={require('../../img/local_img/advertise_3.png')} />
                    </div>
                    <div className="mySlides">
                        <div className="numbertext"><p>4/6</p></div>
                        <img src={require('../../img/local_img/advertise_4.png')} />
                    </div>
                    <div className="mySlides">
                        <div className="numbertext"><p>5/6</p></div>
                        <img src={require('../../img/local_img/advertise_5.png')} />
                    </div>
                    <div className="mySlides">
                        <div className="numbertext"><p>6/6</p></div>
                        <img src={require('../../img/local_img/advertise_1.png')} />
                    </div>

                    {/* <!-- Next and previous buttons --> */}
                    <a className="prev" onClick={() => this.plusSlides(-1)}>&#10094;</a>
                    <a className="next" onClick={() => this.plusSlides(1)}>&#10095;</a>

                    {/* <!-- Image text --> */}
                    <div className="caption-container">
                        <p id="caption"></p>
                    </div>

                    {/* <!-- Thumbnail images --> */}
                    <div className="row advertise-bottom-section">
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_1.png')} onClick={() => this.currentSlide(1)} alt="Tên ứng dụng" />
                        </div>
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_2.png')} onClick={() => this.currentSlide(2)} alt="Giao diện chính" />
                        </div>
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_3.png')} onClick={() => this.currentSlide(3)} alt="Danh sách việc làm" />
                        </div>
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_4.png')} onClick={() => this.currentSlide(4)} alt="Chi tiết công việc" />
                        </div>
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_5.png')} onClick={() => this.currentSlide(5)} alt="Thông tin cá nhân" />
                        </div>
                        <div className="column">
                            <img className="demo cursor img-to-show" src={require('../../img/local_img/advertise_1.png')} onClick={() => this.currentSlide(6)} alt="Tên ứng dụng" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}