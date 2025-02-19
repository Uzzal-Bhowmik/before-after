import ScrollDownLottie from "@/components/custom-lotties/ScrollDownLottie";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

export default function CustomHeroBanner({ background, heading, subHeading }) {
  return (
    <section
      className="flex-center relative h-[75vh] w-full md:h-[90vh] lg:h-[85vh] 2xl:h-screen"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${background?.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ResponsiveContainer classes="text-center 3xl:w-1/2 xl:w-3/4 w-full">
        <h1 className="text-4xl font-bold leading-snug text-white lg:text-5xl 2xl:text-6xl">
          {heading}
        </h1>

        <div className="mx-auto mb-10 mt-5 w-full font-dm-sans text-base lg:w-[85%] lg:text-lg 2xl:w-[75%] 2xl:text-[22px]">
          <p className="text-gray-300">{subHeading}</p>
        </div>

        <div className="absolute bottom-12 left-1/2 mx-auto mt-20 w-max -translate-x-1/2 lg:bottom-32">
          <ScrollDownLottie />
        </div>
      </ResponsiveContainer>
    </section>
  );
}
