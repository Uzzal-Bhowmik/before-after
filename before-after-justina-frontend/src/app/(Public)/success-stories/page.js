import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import successStoriesBg from "/public/images/success-stories/success-stories-bg.png";
import ScrollDownLottie from "@/components/custom-lotties/ScrollDownLottie";
import SuccessStoriesContainer from "./_components/SuccessStoriesContainer";

export const metadata = {
  title: "Success Stories",
  description: "Success Stories page",
};

export default async function SuccessStoriesPage() {
  return (
    <div>
      {/* Top Section */}
      <section
        className="flex-center relative h-[75vh] w-full md:h-[90vh] lg:h-[85vh] 2xl:h-screen"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${successStoriesBg?.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <ResponsiveContainer classes="text-center 3xl:w-1/2 xl:w-3/4 w-full">
          <h1 className="text-4xl font-bold text-white lg:text-5xl 2xl:text-6xl 2xl:leading-snug">
            Transforming Dreams into Reality: Customer Success Stories
          </h1>

          <div className="mb-10 mt-5 font-dm-sans text-base lg:text-lg 2xl:text-[22px]">
            <p className="text-light-gray">
              Explore authentic stories of change from trusted businesses.{" "}
              <br /> See results you can believe in, across industries.
            </p>
          </div>

          <div className="absolute bottom-32 left-1/2 mx-auto mt-20 w-max -translate-x-1/2">
            <ScrollDownLottie />
          </div>
        </ResponsiveContainer>
      </section>

      {/* Services */}
      <ResponsiveContainer>
        <h2 className="my-10 text-center text-4xl font-semibold">
          Explore{" "}
          <span className="text-primary-blue">Inspiring Transformations</span>
        </h2>

        <SuccessStoriesContainer />
      </ResponsiveContainer>
    </div>
  );
}
