import { useEffect, useRef } from "react";
import MetabridgeVideo from "../../Assets/metabridge-video-new.mp4";
import ContactButton from "../ContactButton";

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

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let rafId: number | null = null;

    const updateVideoTime = () => {
      if (!video || video.readyState < 2) return;
      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const scrollProgress = Math.min(1, Math.max(0, scrollTop / scrollRange));
      const targetTime = scrollProgress * video.duration;

      const diff = targetTime - video.currentTime;
      if (Math.abs(diff) > 0.02) {
        video.currentTime += diff * 0.2;
        rafId = requestAnimationFrame(updateVideoTime);
      } else {
        rafId = null;
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateVideoTime);
    };

    // ✅ Force first frame to render by playing a tiny part
    const showFirstFrame = async () => {
      try {
        video.currentTime = 0;
        await video.play();
        setTimeout(() => {
          video.pause();
          video.currentTime = 0;
        }, 150); // play 0.15s to force rendering
      } catch (err) {
        // some mobile browsers block autoplay – handled below
      }
    };

    // ✅ Unlock playback for iOS Safari if autoplay blocked
    const unlockVideo = () => {
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
      });
      window.removeEventListener("touchstart", unlockVideo);
    };

    window.addEventListener("touchstart", unlockVideo, { once: true });
    video.addEventListener("loadeddata", showFirstFrame);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId ?? 0);
      video.removeEventListener("loadeddata", showFirstFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover pointer-events-none"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          src={MetabridgeVideo}
        />

        <div
          className="absolute inset-0 flex flex-col justify-center items-center pt-[77px] px-6"
          style={{
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <div className="max-w-[900px] mx-auto text-center pointer-events-auto">
            <h6 className="text-[#f1f5f8] text-sm md:text-base uppercase mb-3 md:mb-5">
              {t.heroSubTitle}
            </h6>
            <h1 className="text-[#f1f5f8] text-[32px] md:text-[55px] font-medium leading-[42px] md:leading-[74px]">
              {t.heroTitle}
            </h1>
            <p className="text-[#c0d5df] text-sm md:text-lg mt-3 leading-[24px] md:leading-[30px]">
              {t.heroDesc}
            </p>
            <div className="flex justify-center mt-8">
              <ContactButton label={t.contactUsLabel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
