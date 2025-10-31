import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import GridImage1 from "../../Assets/grid-bg1.jpg";
import GridImage2 from "../../Assets/grid-bg2.jpg";
import ContactButton from "../ContactButton";

type MetaProps = {
  t: {
    metaBridgeTitle: string;
    whatYouGetTitle: string;
    youDontGetTitle: string;
    whatYouGetList: string[];
    youDontGetList: string[];
    contactUsLabel: string;
  };
};

const MetaBridgeGridSection  = ({ t }: MetaProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      const t = setTimeout(() => {
        if (!isInView) controls.start("hidden");
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isInView, controls]);



  return (
    <section className="w-full  bg-[#f1f5f8] rounded-b-[21px] overflow-hidden relative z-10 ">
      <div className="w-full overflow-hidden my-12 md:my-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 ">
        {/* Heading */}
        <motion.div
          className=" overflow-hidden "
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 } }
          }}
        >
          <div

            className="self-stretch flex flex-col justify-start items-start gap-2 w-full m-auto pb-5 md:pb-8">
            <h2 className="self-stretch justify-start text-[#051420] text-[28px] md:text-[40px] capitalize">
             {t.metaBridgeTitle}
            </h2>
          </div>

          {/* Grid Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-[_1fr_1fr] gap-5 md:gap-6 ">
            <div
              className="px-5 md:px-10 py-10 md:py-[53px] rounded-[30px]"
              style={{
                backgroundImage: `url(${GridImage1})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }}
            >
              <h3 className="text-white text-[24px] md:text-[28px] capitalize mb-5">
                {t.whatYouGetTitle}
              </h3>
              <div className="space-y-3">
               {t.whatYouGetList.map((text, idx) => (
                  <div className="flex items-center gap-3" key={idx}>
                    <svg
                      className="w-6 h-6 text-[#c0d5df] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <p className="text-[#c0d5df] text-sm satoshi-regular capitalize">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 2 */}
            <div
              className="px-5 md:px-10 py-10 md:py-[53px] rounded-[30px]"
              style={{
                backgroundImage: `url(${GridImage2})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }}
            >
              <h3 className="text-white text-[24px] md:text-[28px] capitalize mb-5">
                {t.youDontGetTitle}
              </h3>
              <div className="space-y-3">
                {t.youDontGetList.map((text, idx) => (
                  <div className="flex items-center gap-3" key={idx}>
                    <svg
                      className="w-6 h-6 text-[#c0d5df] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <p className="text-[#c0d5df] text-sm satoshi-regular capitalize">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Button */}
          <div
            className="flex items-center space-x-4 justify-center mt-6 md:mt-10 "
          >
            <ContactButton label={t.contactUsLabel} />
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default MetaBridgeGridSection;
