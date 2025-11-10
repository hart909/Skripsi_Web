export default function HeroSection({ title, subtitle, image }) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 mt-4">
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden">
        <img
          src={image}
          alt="Hero"
          className="w-full h-full object-cover object-[center_20%] opacity-70"
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl sm:text-5xl font-bold text-center drop-shadow">
            {title}
          </h1>
          <p className="mt-3 text-center text-sm sm:text-base drop-shadow">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
