import { useLayoutEffect, useRef } from "react";
import ContactButton from "../ContactButton";

const VIDEO_SRC = "/comp1.mp4";

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

  useLayoutEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId: number | null = null;
    let targetTime = 0;
    let currentTime = 0;
    let isUserActivated = false;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const updateVideoTime = () => {
      if (!video || video.readyState < 2) {
        rafId = requestAnimationFrame(updateVideoTime);
        return;
      }

      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, scrollTop / Math.max(1, scrollRange))
      );

      targetTime = Math.min(1, progress * 1.5) * (video.duration || 0);
      currentTime = lerp(currentTime, targetTime, 0.25);

      if (Math.abs(video.currentTime - currentTime) > 0.01) {
        try {
          video.currentTime = currentTime;
        } catch {
          // Safari or Chrome might block before user gesture
        }
      }

      rafId = requestAnimationFrame(updateVideoTime);
    };

    const tryActivateVideo = async () => {
      if (isUserActivated) return;
      isUserActivated = true;
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
      } catch {
        console.warn("Autoplay blocked, waiting for user gesture...");
      }
    };

    const onUserGesture = async () => {
      await tryActivateVideo();
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };
   // Play briefly on page load (0.5s)
    const playBriefly = async () => {
      try {
        await video.play();
        setTimeout(() => {
          video.pause();
          video.currentTime = 0;
        }, 500); // 0.5 seconds
      } catch (err) {
        console.warn("Initial autoplay blocked:", err);
      }
    };

    playBriefly();
    window.addEventListener("scroll", () => {
      if (!rafId) rafId = requestAnimationFrame(updateVideoTime);
    });
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });

    rafId = requestAnimationFrame(updateVideoTime);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          src={VIDEO_SRC}
        />

        <div className="absolute inset-0 z-30 flex flex-col justify-center items-center pt-[77px] px-6">
          <div className="max-w-[900px] mx-auto text-center">
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
