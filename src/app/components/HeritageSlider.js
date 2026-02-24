"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const places = [
  {
    name: "हवा महल",
    image: "/hawamahal.jpg",
  },
  {
    name: "जैसलमेर रो किल्लो",
    image: "/jaisalmer.jpg",
  },

  {
    name: "विजय रो स्तंभ",
    image: "/vijaystambh.jpg",
  },
  {
    name: "थार रो मरुस्थल",
    image: "/thardesert.jpg"
  },
  {
    name: "केवला देव घणा पक्षी विहार, भरतपुर",
    image: "/kewaladev_Ghana.jpeg"
  },
  {
    name: "कोटा शहर - राजस्थान",
    image: "/kota_city.jpeg"
  },
  {
    name: "रणथंभौर किला - राजस्थान",
    image: "/ranthamBhor_kila.jpeg"
  },
    {
    name: "खूबसूरत झीलों की नगरी उदयपुर, राजस्थान",
    image: "/Udaypur_jheel.jpeg"
  }

];

export default function HeritageSlider() {
  return (
    <section className="heritage-slider">
      <h2 className="title">म्हारो राजस्थान, म्हारी गौरवशाली धरोहर</h2>

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
            <div className="heritage_card">
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
