import { useEffect, useRef, useState } from 'react';
import MetabridgeVideo from "../../Assets/metabridge-video-new.mp4";
import ContactButton from '../ContactButton';
type Props = {
  t: {
    heroSubTitle: string;
    heroTitle: string;
    heroDesc: string; 
    contactUsLabel: string;
  };
};

export default function VideoScrubSection({ t }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let targetTime = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollRange = container.offsetHeight - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
      targetTime = scrollProgress * video.duration;
    };

    const animate = () => {
      if (video && video.duration) {
        let diff = targetTime - video.currentTime;

        // Force minimum change for Chrome to register
        if (Math.abs(diff) < 0.05) {
          diff = diff < 0 ? -0.05 : 0.05;
        }

        video.currentTime = video.currentTime + diff * 0.2;

        // Clamp to video duration
        if (video.currentTime > video.duration) video.currentTime = video.duration;
        if (video.currentTime < 0) video.currentTime = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      handleScroll();
    };

    const unlockVideo = () => {
      video.play().then(() => video.pause()).catch(() => { });
      window.removeEventListener("touchstart", unlockVideo);
    };
    window.addEventListener("touchstart", unlockVideo);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    window.addEventListener('scroll', handleScroll, { passive: true });

    animate();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', unlockVideo);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '300vh', willChange: 'transform' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="auto"
          muted
          playsInline
          src={MetabridgeVideo}
        />
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-xl">Loading video...</div>
          </div>
        )}
        <div className="self-stretch inline-flex flex-col justify-center items-center gap-5 absolute inset-0 pt-[77px] ">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14">
            <h6 className="self-stretch text-center justify-start text-[#f1f5f8] text-sm md:text-base font-normal uppercase mb-3 md:mb-5">{t.heroSubTitle}</h6>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <h1 className="self-stretch text-center justify-start text-[#f1f5f8] text-[32px] md:text-[55px] font-medium  leading-[42px] md:leading-[74px]">{t.heroTitle}</h1>
              <p className="self-stretch text-center justify-start text-[#c0d5df] text-sm md:text-lg font-normal  leading-[24px] md:leading-[30px]">{t.heroDesc}</p>
            </div>
            <div className="flex items-center space-x-4 justify-center mt-6 md:mt-10">
              <ContactButton label={t.contactUsLabel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
