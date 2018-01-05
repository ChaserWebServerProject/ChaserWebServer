import React, { Component } from 'react';

import '../../public/content/css/image-box.scss';

export default class ImageBox extends Component {
    render() {
        return (
            <div className="img-box-container">
                {/* <!-- The Image Box Modal --> */}
                <div className="image-box-modal">
                    <span className="imag-box-close">&times;</span>
                    <img className="image-content" id="image-show" />
                    <div className="image-box-caption"></div>
                </div>
            </div>
        );
    }

    onAddImgBoxJqueryEvents(src, caption) {
        // Get the modal
        var modal = document.getElementsByClassName('image-box-modal')[0];
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var imgShow = document.getElementById("image-show");
        var captionText = document.getElementsByClassName("image-box-caption")[0];
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("imag-box-close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
        $(document).on('click', '.img-to-show', function (e) {
            imgShow.src = this.src;
            captionText.innerHTML = this.alt;
            modal.style.display = "block";
        });
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    componentDidMount() {
        this.onAddImgBoxJqueryEvents();
    }
}
