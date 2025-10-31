import { motion, useInView, useAnimation } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import RequestAccess from "../../Assets/request-access.png";
import QuickSetup from "../../Assets/quick-setup.png";
import CreditLine from "../../Assets/credit-line.png";
import Support from "../../Assets/support.png";
import DotBg from "../../Assets/dot-bg.png";
import RequestAccessTab from "../../Assets/request-access-tab.png";
import RequestAccessTabIT from "../../Assets/request-access-tab-it.png";
import QuickSetupTab from "../../Assets/quick-setup-tab.png";
import QuickSetupTabIT from "../../Assets/quick-setup-tab-it.png";
import CreditLineTab from "../../Assets/credit-line-tab.png";
import CreditLineTabIT from "../../Assets/credit-line-tab-it.png";
import SupportTab from "../../Assets/support-tab.png";
import SupportTabIT from "../../Assets/support-tab-it.png";
import MarqueeTextCard from "./MarqueeTextCard";
import MarqueeTextCard2 from "./MarqueeTextCard2";

type Props = {
  t: {
    tabSectionTitle: string;
    tabSectionDec: string;
    tabNameFirst: string;
    tabFirstDesc: string; 
    tabNameSecond: string;
    tabSecondDesc: string;
    tabNameThird: string;
    tabThirdDesc: string;
    tabNameFourth: string;
    tabFourthDesc: string;
    marqueeTexts: string[];
    marqueeTexts2: string[];
    lang: "en" | "it";
  };
};

const TabSection = ({ t }: Props) => {
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const autoSwitchInterval = 10000;


    const tabs = [
    { title: t.tabNameFirst, icon: <img src={RequestAccess} alt="Tab 1" className="w-[30px] lg:w-[60px]" /> },
    { title: t.tabNameSecond, icon: <img src={QuickSetup} alt="Tab 2" className="w-[30px] lg:w-[60px]" /> },
    { title: t.tabNameThird, icon: <img src={CreditLine} alt="Tab 3" className="w-[30px] lg:w-[60px]" /> },
    { title: t.tabNameFourth, icon: <img src={Support} alt="Tab 4" className="w-[30px] lg:w-[60px]" /> }
];

    const resetProgress = (tabIndex: number) => {
        setActiveTab(tabIndex);
        setProgress(0);
    };

    // Auto-switch tabs
    useEffect(() => {
        const stepTime = autoSwitchInterval / 100;
        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setActiveTab(prevTab => (prevTab + 1) % tabs.length);
                    return 0;
                }
                return prev + 1;
            });
        }, stepTime);

        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        };
    }, []);

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

    return (
        <div className="w-full my-10 md:my-24 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 100 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 } }
                    }}
                >
                    <div className="self-stretch flex flex-col justify-start items-start gap-2 w-full max-w-[1117px] m-auto pb-6 md:pb-10">
                        <h2 className="self-stretch text-center justify-start text-[#f1f5f8] text-[32px] md:text-[55px] font-medium  leading-[42px] md:leading-[74px] capitalize">
                           {t.tabSectionTitle}
                            </h2>
                        <p className="self-stretch text-center justify-start text-[#c0d5df] text-sm md:text-lg font-normal  leading-[24px] md:leading-[30px]">
                            {t.tabSectionDec}
                        </p>
                    </div>
                    {/* Tabs */}
                    <div className="flex flex-wrap md:flex-nowrap mb-4 md:mb-7 gap-2 ">
                        {tabs.map((tab, index) => (
                            <div
                                key={index}
                                className="relative flex-[1_1_48%] md:flex-1 cursor-pointer rounded-md overflow-hidden bg-[rgba(255,255,255,0.1)]"
                                onClick={() => resetProgress(index)}
                            >
                                {activeTab === index && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#173649] z-0"
                                        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
                                    />
                                )}
                                <div className="satoshi-bold relative z-10 py-3 text-[#b2cad9] text-sm md:text-base flex items-center justify-center md:justify-start gap-2 lg:gap-5 p-[10px]">
                                    {tab.icon}
                                    {tab.title}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#051420] rounded-[30px] p-[10px] min-h-[500px]">
                        {/* Tab Content */}
                        {activeTab === 0 && (
                            <motion.div
                                key={`tab-0`} // force re-animation on tab change
                                className="grid grid-cols-[1.5fr] md:grid-cols-[0.6fr_1.5fr] gap-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -100, rotate: -5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="bg-[#b2cad9] rounded-[20px] p-5 flex flex-col justify-between gap-5"
                                >
                                    <h4 className="self-stretch justify-start text-[#0b1016] text-xl capitalize">01</h4>
                                    <div className="self-stretch inline-flex flex-col justify-start items-start gap-[9px]">
                                        <h3 className="self-stretch justify-start text-[#0b1016] text-xl md:text-2xl capitalize">{t.tabNameFirst}</h3>
                                        <p className="text-[#0B1013] text-sm md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                           {t.tabFirstDesc}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    key={`tab-0-image`}
                                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="relative bg-[#1e2b36] rounded-[20px] overflow-hidden pt-12 md:pt-20 px-5 md:px-8 pb-0 flex flex-col justify-end gap-5"
                                    style={{
                                        backgroundImage: `url(${DotBg})`,
                                        backgroundRepeat: "repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <img className="w-full max-w-[603px] m-auto" src={t.lang === "it" ? RequestAccessTabIT : RequestAccessTab} alt="Request Access" />
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 1 && (
                            <motion.div
                                key={`tab-1`} // force re-animation
                                className="grid grid-cols-[1.5fr] md:grid-cols-[0.6fr_1.5fr] gap-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -100, rotate: -5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="bg-[#b2cad9] rounded-[20px] p-5 flex flex-col justify-between gap-5"
                                >
                                    <h4 className="self-stretch justify-start text-[#0b1016] text-xl capitalize">02</h4>
                                    <div className="self-stretch inline-flex flex-col justify-start items-start gap-[9px]">
                                        <h3 className="self-stretch justify-start text-[#0b1016] text-xl md:text-2xl capitalize">{t.tabNameSecond}</h3>
                                        <p className="text-[#0B1013] text-sm md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                            {t.tabSecondDesc}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    key={`tab-1-image`}
                                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="relative bg-[#1e2b36] rounded-[20px] overflow-hidden py-12 md:py-20 px-5 md:px-8 flex flex-col justify-between gap-5"
                                    style={{
                                        backgroundImage: `url(${DotBg})`,
                                        backgroundRepeat: "repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <img className="w-full max-w-[656px] m-auto" src={t.lang === "it" ? QuickSetupTabIT : QuickSetupTab} alt="Quick Setup" />
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 2 && (
                            <motion.div
                                key={`tab-2`} // force re-animation
                                className="grid grid-cols-[1.5fr] md:grid-cols-[0.6fr_1.5fr] gap-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -100, rotate: -5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="bg-[#b2cad9] rounded-[20px] p-5 flex flex-col justify-between gap-5"
                                >
                                    <h4 className="self-stretch justify-start text-[#0b1016] text-xl capitalize">03</h4>
                                    <div className="self-stretch inline-flex flex-col justify-start items-start gap-[9px]">
                                        <h3 className="self-stretch justify-start text-[#0b1016] text-xl md:text-2xl capitalize">{t.tabNameThird}</h3>
                                        <p className="text-[#0B1013] text-sm md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                            {t.tabThirdDesc}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    key={`tab-2-image`}
                                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="relative bg-[#1e2b36] rounded-[20px] overflow-hidden pt-12  pb-0 flex flex-col justify-end gap-5"
                                    style={{
                                        backgroundImage: `url(${DotBg})`,
                                        backgroundRepeat: "repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <MarqueeTextCard items={t.marqueeTexts}/>
                                    <MarqueeTextCard2 items={t.marqueeTexts2}/>
                                    <img className="w-full max-w-[603px] m-auto px-5 md:px-8 pt-4" src={t.lang === "it" ? CreditLineTabIT : CreditLineTab} alt="Credit Line" />
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 3 && (
                            <motion.div
                                key={`tab-3`} // force re-animation
                                className="grid grid-cols-[1.5fr] md:grid-cols-[0.6fr_1.5fr] gap-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -100, rotate: -5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="bg-[#b2cad9] rounded-[20px] p-5 flex flex-col justify-between gap-5"
                                >
                                    <h4 className="self-stretch justify-start text-[#0b1016] text-xl capitalize">04</h4>
                                    <div className="self-stretch inline-flex flex-col justify-start items-start gap-[9px]">
                                        <h3 className="self-stretch justify-start text-[#0b1016] text-xl md:text-2xl capitalize">{t.tabNameFourth}</h3>
                                        <p className="text-[#0B1013] text-sm md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                           {t.tabFourthDesc}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    key={`tab-3-image`}
                                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 12, duration: 1, delay: 0.5 }}
                                    className="relative bg-[#1e2b36] rounded-[20px] overflow-hidden py-12 md:py-20 px-5 md:px-8 flex flex-col justify-between gap-5"
                                    style={{
                                        backgroundImage: `url(${DotBg})`,
                                        backgroundRepeat: "repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <img className="w-full max-w-[560px] m-auto" src={t.lang === "it" ? SupportTabIT : SupportTab} alt="Support Tab" />
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default TabSection;
