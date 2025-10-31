import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import LeftImage from "../../Assets/image-left.jpg";
import CenterImage from "../../Assets/image-center.png";
import RightImage from "../../Assets/image-right.jpg";
import PinLogo from "../../Assets/pin-logo.png";
import ContactButton from "../ContactButton";
import BeforeShape from "../../Assets/before-shape.png";
import AfterShape from "../../Assets/after-shape.png";

type ImagePinnedProps = {
    t: {
      ImagePinnedSectionTitle:string;
      ImagePinnedSectionDesc:string;
      contactUsLabel:string;
    };
  };

const ImagePinnedSection = ({ t }: ImagePinnedProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const circleScale = useTransform(scrollYProgress, [0, 0.7], [0, 6]);
  const circleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.6, 0.95], [0, 1, 1, 0]);

  const leftOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);
  const leftY = useTransform(scrollYProgress, [0.2, 0.4], [0, -150]);

  const rightOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);
  const rightY = useTransform(scrollYProgress, [0.2, 0.4], [0, -150]);

  const centerScale = useTransform(scrollYProgress, [0.4, 0.7], [1, 4.5]);
  const centerOpacity = useTransform(scrollYProgress, [0.6, 0.95], [1, 0]);

  const textOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.7, 0.9], [600, 0]);

  return (
    <section ref={ref} className="relative h-[350vh] mt-[-20px] ">
      {/* Sticky container */}
      <div className="sticky top-0 flex items-center justify-center h-screen overflow-hidden">
         <img
              src={BeforeShape}
              alt="Before Shape"
              className="absolute bottom-0 left-0 w-full max-w-[224px] md:ax-w-[324px] object-cover"
            />
        {/* Grid for Images */}
        <div className="grid md:grid-cols-[0.6fr_1.1fr_0.6fr] gap-2 w-full items-center mt-[77px] p-4 sm:p-6 lg:p-8 xl:p-14 h-[calc(100vh-77px)] relative z-10">
          {/* Left Image */}
          <motion.div
            style={{ opacity: leftOpacity, y: leftY }}
            className="hidden md:block w-full h-full rounded-[20px] overflow-hidden"
          >
            <img
              src={LeftImage}
              alt="Left"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Center Image */}
          <motion.div
            style={{ scale: centerScale, opacity: centerOpacity }}
            className="w-full h-full rounded-[20px] overflow-hidden z-10"
          >
            <img
              src={CenterImage}
              alt="Center"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Image */}
          <motion.div
            style={{ opacity: rightOpacity, y: rightY }}
            className="hidden md:block w-full h-full rounded-[20px] overflow-hidden"
          >
            <img
              src={RightImage}
              alt="Right"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Black Circle */}
        <motion.div
          style={{
            scale: circleScale,
            opacity: circleOpacity,
          }}
          className="absolute w-14 h-28 md:w-28 md:h-48 bg-[#0b1016] rounded-[60px] z-20 mt-[77px]"
        />

        {/* Text */}
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
          }}
          className="absolute z-30 w-full flex items-center justify-center top-[35%] md:top-1/2 -translate-y-1/2 mt-[-77px]"
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 ">
            <div className="grid grid-cols-1 items-center md:grid-cols-[_1.3fr_1fr] gap-7 md:gap-6 ">
              <div>
                <h2 className="text-center md:text-left self-stretch justify-start text-[#fff] text-[28px] md:text-[40px] capitalize">
                  {t.ImagePinnedSectionTitle}
                </h2>
                <p className="text-center md:text-left  self-stretch justify-start text-[#c0d5df] text-sm md:text-lg font-normal leading-[24px] md:leading-[30px]">
                  {t.ImagePinnedSectionDesc}
                </p>
                <div
                  className="flex items-start space-x-4 justify-center md:justify-start mt-6 md:mt-7 "
                >
                  <ContactButton label={t.contactUsLabel} />
                </div>
              </div>
              <div>
                <img
                  src={PinLogo}
                  alt="Pin Logo"
                  className="w-full m-auto  object-cover max-w-[200px] md:max-w-[342px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
        <img
              src={AfterShape}
              alt="After Shape"
              className="absolute top-0 right-0 w-full max-w-[224px] md:ax-w-[324px] object-cover"
            />
      </div>

    </section>
  );
};

export default ImagePinnedSection;