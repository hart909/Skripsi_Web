import React, { useState, useEffect } from "react";

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[420px] px-4 sm:px-6 mt-6">
      <div className="w-full h-full rounded-2xl overflow-hidden relative">

        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="
                w-full h-full object-cover 
                object-[50%_12%] 
                scale-[0.95]         
                transition-all duration-700 ease-in-out
                rounded-lg
              "
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white drop-shadow-lg">
              <h1 className="text-3xl sm:text-5xl font-bold text-center">
                {slide.title}
              </h1>
              <p className="mt-3 text-center text-sm sm:text-base">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 
                ${i === index ? "bg-white scale-125" : "bg-white/50"}
              `}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
