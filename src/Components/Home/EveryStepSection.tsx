import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, useAnimation } from "framer-motion";

const isIOS = typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.platform) || (typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) && 'ontouchend' in document);
type everyProps = {
    t: {
        everyStepTitleDesktop: string;
        everyStepTitleLeft: string;
        everyStepTitleRight: string;
        everyStepTitleMobile: string;
        everyStepTitleBoxFirst: string;
        everyStepTitleBoxLast: string;
        
        everyStepWhiteBoxTitle: string;
        everyStepWhiteBoxDesc: string;

        cardFirstTitle: string;
        cardFirstDesc: string;
        cardFirstList1: string;
        cardFirstList2: string;

        cardTwoTitle: string;
        cardTwotDesc: string;
        cardTwoList1: string;
        cardTwoList2: string;

        cardThreeTitle: string;
        cardThreeDesc: string;
        cardThreeList1: string;
        cardThreeList2: string;
    };
};
export default function PinnedScrollSection({ t }: everyProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        let ticking = false;

        const computeProgress = () => {
            if (!sectionRef.current) return;

            const section = sectionRef.current;
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;

            let progress: number;
            if (rect.top <= 0 && rect.bottom >= windowHeight) {
                progress = Math.abs(rect.top) / (sectionHeight - windowHeight);
            } else if (rect.top > 0) {
                progress = 0;
            } else {
                progress = 1;
            }

            setScrollProgress(Math.min(Math.max(progress, 0), 1));
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(computeProgress);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        requestAnimationFrame(computeProgress);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 1);
    const ease = isIOS ? easeOutQuad : easeOutCubic;

    const maxScale = useMemo(() => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        return w < 640 ? 4 : 10;
    }, []);

    const eased = ease(scrollProgress);

    const boxScale = 1 + (eased * maxScale);
    const boxOpacity = scrollProgress < 0.7 ? 1 : Math.max(0, 1 - ((scrollProgress - 0.7) / 0.18));
    const contentOpacity = scrollProgress > 0.62 ? Math.min(1, (scrollProgress - 0.6) / 0.22) : 0;
    const titleOpacity = scrollProgress < 0.32 ? 1 : Math.max(0, 1 - ((scrollProgress - 0.32) / 0.24));
    const bgWhite = scrollProgress > 1;

    const contentPointerEvents = contentOpacity > 0.05 ? 'auto' : 'none';
    const titlePointerEvents = titleOpacity > 0.05 ? 'auto' : 'none';

    return (
        <div className="">
            <section
                ref={sectionRef}
                className="relative h-[300vh]"
                style={{
                    backgroundColor: bgWhite ? '#f1f5f8' : '#0b1016',
                    transition: 'background-color 0.3s ease-out',
                    WebkitTransform: 'translateZ(0)',
                    willChange: 'background-color'
                }}
            >
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ willChange: 'transform' }}>
                    <div
                        className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 lg:px-8 xl:px-14"
                        style={{
                            opacity: titleOpacity,
                            pointerEvents: titlePointerEvents,
                            transition: 'opacity 0.25s ease-out',
                            willChange: 'opacity, transform'
                        }}
                    >
                        <motion.div
                            className="text-center"
                            ref={ref}
                            initial="hidden"
                            animate={controls}
                            variants={{
                                hidden: { opacity: 0, y: 100 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 } }
                            }}
                        >
                            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white leading-none flex flex-wrap items-center justify-center gap-3 capitalize">
                                <span className="block leading-normal md:hidden">{t.everyStepTitleMobile}</span>
                                <span className="hidden md:block">{t.everyStepTitleDesktop}</span>
                                <span className="block w-full"></span>
                                <span className="hidden md:block">{t.everyStepTitleLeft}</span>

                                {/* White Box Between Words */}
                                <span
                                    className="inline-block bg-[#f1f5f8] rounded-lg shadow-2xl"
                                    style={{
                                        width: `${100 * boxScale}px`,
                                        height: `${50 * boxScale}px`,
                                        fontSize: `${6 * boxScale}px`,
                                        transition: 'all 0.2s ease-out',
                                        opacity: boxOpacity,
                                        WebkitFontSmoothing: 'antialiased',
                                        textRendering: 'optimizeLegibility',
                                    }}
                                >
                                    <div className="w-full h-full flex items-center justify-center p-3">
                                        <div className="text-gray-900 text-center">
                                            <div className="glancyr-medium mb-1">{t.everyStepTitleBoxFirst}</div>
                                            <div className="glancyr-medium">{t.everyStepTitleBoxLast}</div>
                                        </div>
                                    </div>
                                </span>


                                <span className="hidden md:block">{t.everyStepTitleRight}</span>
                            </h2>
                        </motion.div>
                    </div>

                    {/* Full Screen Content */}
                    <div
                        className="absolute pt-[90px] inset-0 z-30 bg-[#f1f5f8] flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-14 overflow-y-auto rounded-t-[21px]"
                        style={{
                            opacity: contentOpacity,
                            pointerEvents: contentPointerEvents,
                            transition: 'opacity 0.25s ease-out',
                            willChange: 'opacity',
                            WebkitTransform: 'translateZ(0)'
                        }}
                    >
                        <div className="w-full max-w-[968px]">
                            <h2 className="text-center text-3xl md:text-5xl lg:text-6xl text-[#0B1013] max-w-2xl m-auto leading-normal flex flex-wrap items-center justify-center gap-3 capitalize">
                                {t.everyStepWhiteBoxTitle}
                            </h2>

                            <p className="text-center text-[#0B1013] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px] mt-4 mb-4 md:mb-9">
                                {t.everyStepWhiteBoxDesc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.1fr_0.95fr] gap-2 md:gap-6">
                                <div className="bg-white rounded-[20px] p-4 md:p-8 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-xl md:text-2xl text-[#051420] leading-none mb-3">{t.cardFirstTitle}</h3>
                                    <p className="text-[#0B1013] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px] mb-2">
                                        {t.cardFirstDesc}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardFirstList1}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardFirstList2}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[20px] p-4 md:p-12 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-xl md:text-2xl text-[#051420] leading-none mb-3">{t.cardTwoTitle}</h3>
                                    <p className="text-[#0B1013] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px] mb-2">
                                        {t.cardTwotDesc}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardTwoList1}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardTwoList2}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[20px] p-4 md:p-8 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-xl md:text-2xl text-[#051420] leading-none mb-3">{t.cardThreeTitle}</h3>
                                    <p className="text-[#0B1013] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px] mb-2">
                                        {t.cardThreeDesc}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardThreeList1}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#454b51] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-[#454B50] text-xs md:text-lg satoshi-regular leading-[24px] md:leading-[30px]">
                                                {t.cardThreeList2}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
