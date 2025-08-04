import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Spinner from "./Spinner";

interface Slide {
  _id: string;
  imageUrls?: string[];
  title: string;
  description: string;
  price: number;
}

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("http://localhost:4000/instruments/featured", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setSlides(data);
      } catch (error) {
        console.error("Error cargando slides", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (loading) return <Spinner />;
  if (slides.length === 0) return null;

  return (
    <section className="w-full mb-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-start px-6 lg:px-20 text-white"
              style={{
                backgroundImage: `url(${
                  slide.imageUrls
                    ? `http://localhost:4000${slide.imageUrls[0]}`
                    : "https://via.placeholder.com/800x400?text=Sin+Imagen"
                })`,
              }}
            >
              <div className="bg-black/50 p-6 rounded-xl max-w-lg relative">
                <h2 className="text-2xl md:text-4xl font-bold pr-14">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm md:text-base pr-20 md:pr-24">
                  {slide.description}
                </p>
                <span className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
                  ${slide.price}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
