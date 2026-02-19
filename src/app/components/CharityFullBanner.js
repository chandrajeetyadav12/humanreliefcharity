"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function CharityFullBanner({ slides }) {
  return (
    <div className="charity-full-banner container-fluid p-0">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 6000 }}
        loop
        className="full-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="row banner-slide gx-0">
              {/* Left content */}
              <div
                className="col-md-12 d-flex align-items-center position-relative slide-left p-0"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className="overlay position-absolute"></div>
                <div className="content-left text-white p-4">
                  <h1 className="title-hindi">{slide.titleHindi}</h1>
                  <h2 className="title-english">{slide.titleEnglish}</h2>
                  <p className="subtitle">{slide.subtitle}</p>
                  <div className="buttons mt-3">
                    {/* <button className="btn btn-outline-light me-2">Register</button> */}
                    {/* <button className="btn btn-success">Login</button> */}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
