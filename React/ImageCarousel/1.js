import "./ImageCarousel.css";
import React, { useState } from "react";

// src/ImageCarousel.js

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="carousel">
            <button onClick={prevImage} className="carousel-button">
                &#10094;
            </button>
            <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="carousel-image" />
            <button onClick={nextImage} className="carousel-button">
                &#10095;
            </button>
        </div>
    );
};

export default ImageCarousel;
