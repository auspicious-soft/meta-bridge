import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import MetaEcosystem from "../../Assets/meta-ecosystem.png";
import MetaEcosystemIt from "../../Assets/meta-ecosystem-it.png";
import ContactButton from "../ContactButton";
type Props = {
    t: {
        chooseMetabridgeTitle: string;
        chooseMetabridgeDesc: string;
        contactUsLabel: string;
        lang: "en" | "it";
    };
};

const ChooseMetabridgeSection = ({ t }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            setTimeout(() => {
                if (!isInView) controls.start("hidden");
            }, 100);
        }
    }, [isInView, controls]);

    // 🔹 Choose image based on language
    const selectedImage =
        t.lang === "it" ? MetaEcosystemIt : MetaEcosystem;

    return (
        <div className="w-full overflow-hidden mb-12 mb:my-24 pt-12 md:pt-24">
            <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14">
                <motion.div className="relative bg-[#b2cad9] rounded-[32px] py-10 md:py-16 px-5 md:px-12 flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0"
                    ref={ref}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 100 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 } }
                    }}
                >

                    <motion.div
                        className="w-full lg:w-[40%]"
                        initial={{ opacity: 0, x: -100, rotate: -5 }}
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, x: -100, rotate: -5 },
                            visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 } }
                        }}
                    >
                        <h2 className="text-[#051420] text-[28px] md:text-[40px] capitalize">
                            {t.chooseMetabridgeTitle}
                        </h2>
                        <p className="text-[#0B1013] text-sm md:text-lg satoshi-regular leading-[24px] md:leading-[30px] mt-4">
                            {t.chooseMetabridgeDesc}
                        </p>
                        <div className="flex items-center space-x-4 mt-5 md:mt-7">
                            <ContactButton label={t.contactUsLabel} />
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-[60%]"
                        initial={{ opacity: 0, x: 100, rotate: 5 }}
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, x: 100, rotate: 5 },
                            visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 } }
                        }}
                    >
                        <img
                            className="w-full max-w-2xl m-auto"
                            src={selectedImage}
                            alt="Meta Ecosystem"
                        />
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}

export default ChooseMetabridgeSection;
