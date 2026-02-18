"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const places = [
  {
    name: "Hawa Mahal",
    image: "/hawamahal.jpg",
  },
  {
    name: "Jaisalmer Fort",
    image: "/jaisalmer.jpg",
  },

  {
    name: "Vijaystambh",
    image: "/vijaystambh.jpg",
  },
  {
    name:"Thar Desert",
    image:"/thardesert.jpg"
  }

];

export default function HeritageSlider() {
  return (
    <section className="heritage-slider">
      <h2 className="title">Proud Heritage of Rajasthan</h2>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {places.map((place, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <Image
                src={place.image}
                alt={place.name}
                width={500}
                height={350}
                className="image"
              />
              <h3>{place.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
