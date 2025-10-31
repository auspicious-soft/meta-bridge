import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import ContactButton from "./ContactButton";
import FooterBG from "../Assets/footer-bg.png"
import useDetectCountry from "../Hooks/useDetectCountry";
import translations from "../translations";


const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const controls = useAnimation();
        const country = useDetectCountry();
    const lang = country === "IT" ? "it" : "en";
    const t = translations[lang];

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
        <footer className="w-full overflow-hidden">

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


                    <div className="border-b-0 border border-[#4c4c4c] rounded-3xl  md:rounded-[100px]  lg:rounded-[208.5px] pt-4 md:pt-8 px-[2px] md:px-1 mt-6">

                        <div
                            className="relative bg-[#000002]  rounded-3xl md:rounded-[100px]  lg:rounded-[300px] overflow-hidden py-[40px] md:py-[90px] px-5 md:px-12">
                            <img src={FooterBG} alt="FooterBG"
                                className="absolute w-full object-cover inset-0 h-full"
                            />
                            <div className="w-full max-w-[80%] left-[10%] h-[120px]  top-[84%] absolute bg-[#009aff] rounded-full blur-[75px]" />
                            <div className=" inline-flex flex-col justify-start items-center gap-0 w-full">
                                <div className="self-stretch flex flex-col justify-start items-center gap-2 max-w-[913px] m-auto w-full">
                                    <h2 className="self-stretch text-center justify-start text-[#f1f5f8] text-[32px] md:text-[55px] font-medium  leading-[42px] md:leading-[74px]">{t.footerTitle}</h2>
                                    <p className="self-stretch text-center justify-start text-[#c0d5df] text-sm md:text-lg font-normal  leading-[24px] md:leading-[30px]">{t.footerDescription}</p>
                                </div>
                                <div
                                    className="flex items-center space-x-4 justify-center md:justify-start mt-6 md:mt-10 "
                                >
                                    <ContactButton label={t.contactUsLabel} />
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 py-3 ">
                <p className="text-center text-[#c0d5df] text-sm  font-normal leading-[24px] md:leading-[30px]">{t.footerCopyright}</p>
            </div>

        </footer>
    );
}

export default Footer;
