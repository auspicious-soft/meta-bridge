import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import TailorMadeImage from "../../Assets/tailor-made-image.png";
import ContactButton from "../ContactButton";

type ImagePinnedProps = {
    t: {
      TailorMadeSectionTitle:string;
      TailorMadeSectionDesc:string;
      contactUsLabel:string;
    };
  };

const TailorMadeSection = ({ t }: ImagePinnedProps) => {
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
    <section className="w-full overflow-hidden ">
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

            {/* Grid Section */}
            <div
              className="grid grid-cols-1 items-center md:grid-cols-[_1fr_1fr] gap-5 md:gap-12 ">
              <div>
                <h2 className="text-center md:text-left self-stretch justify-start text-[#fff] text-[28px] md:text-[40px] capitalize max-w-xl w-full">
                  {t.TailorMadeSectionTitle}
                </h2>
                <p className="text-center md:text-left  self-stretch justify-start text-[#c0d5df] text-sm md:text-lg font-normal leading-[24px] md:leading-[30px] max-w-xl w-full">
                  {t.TailorMadeSectionDesc}
                  </p>
                <div
                  className="flex items-start space-x-4 justify-center md:justify-start mt-6 md:mt-7 "
                >
                  <ContactButton label={t.contactUsLabel} />
                </div>
              </div>
              {/* Grid 2 */}
              <div>
                <img
                  src={TailorMadeImage}
                  alt="Tailor Made Image"
                  className="w-full m-auto  object-cover "
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TailorMadeSection;
