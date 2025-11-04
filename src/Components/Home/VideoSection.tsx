import { useLayoutEffect, useRef, useState } from "react";
import ContactButton from "../ContactButton";

const VIDEO_SRC = "/metabridge-video-14.mp4";
const POSTER_SRC = "/metabridge-video-poster.png";

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
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId: number | null = null;
    let targetTime = 0;
    let currentTime = 0;
    let isUserActivated = false;

    // ✅ Linear interpolation helper (smooth catching up)
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const markReady = () => setIsReady(true);

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

      // ✅ Compute target time based on scroll progress
      targetTime = progress * (video.duration || 0);

      // ✅ Faster responsiveness (0.18 = quicker catch-up)
      currentTime = lerp(currentTime, targetTime, 0.18); 

      if (Math.abs(video.currentTime - currentTime) > 0.01) {
        try {
          video.currentTime = currentTime;
        } catch {
          // Chrome may block before play gesture
        }
      }

      rafId = requestAnimationFrame(updateVideoTime);
    };

    const tryActivateVideo = async () => {
      if (isUserActivated) return;
      isUserActivated = true;
      try {
        await video.play();
        video.pause(); // forces Chrome to decode frames
        video.currentTime = 0;
        markReady();
      } catch {
        console.warn("Autoplay blocked, waiting for user gesture...");
      }
    };

    const onUserGesture = async () => {
      await tryActivateVideo();
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };

    video.addEventListener("loadeddata", markReady);
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
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* ✅ Gradient background while loading */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#12202c] to-[#0b1016]" />
        )}

        {/* ✅ Poster fallback */}
        <img
          src={POSTER_SRC}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* ✅ Single video for all devices */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          poster={POSTER_SRC}
          src={VIDEO_SRC}
        />

        {/* ✅ Overlay text */}
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
