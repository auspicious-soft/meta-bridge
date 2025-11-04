import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId: number;
    let targetTime = 0;
    let smoothTime = 0;
    let lastProgress = 0;
    let lastScrollY = window.scrollY;
    let isUserActivated = false;

    const markReady = () => setIsReady(true);

    const updateVideoTime = () => {
      if (!video || video.readyState < 2 || !video.duration) {
        rafId = requestAnimationFrame(updateVideoTime);
        return;
      }

      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / Math.max(1, scrollRange)));
      targetTime = progress * video.duration;

      // --- Determine scroll direction and velocity ---
      const scrollDelta = window.scrollY - lastScrollY;
      const direction = Math.sign(scrollDelta);
      const speed = Math.min(1, Math.abs(scrollDelta) / 100); // normalized 0–1
      lastScrollY = window.scrollY;

      // --- Adaptive easing ---
      // Faster blending when reversing or moving quickly
      let baseLerp = 0.15;
      if (direction < 0) baseLerp = 0.25; // smoother backward
      baseLerp += speed * 0.1; // dynamically accelerate with speed

      const diff = targetTime - smoothTime;
      smoothTime += diff * baseLerp;

      if (Math.abs(video.currentTime - smoothTime) > 0.002) {
        try {
          video.currentTime = smoothTime;
        } catch {
          /* Ignore Chrome pre-play restrictions */
        }
      }

      lastProgress = progress;
      rafId = requestAnimationFrame(updateVideoTime);
    };

    // --- Chrome autoplay unlock ---
    const tryActivateVideo = async () => {
      if (isUserActivated) return;
      isUserActivated = true;
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
        markReady();
      } catch {
        console.warn("Autoplay blocked; waiting for user gesture…");
      }
    };

    const onUserGesture = async () => {
      await tryActivateVideo();
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };

    rafId = requestAnimationFrame(updateVideoTime);
    video.addEventListener("loadeddata", markReady);
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadeddata", markReady);
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#12202c] to-[#0b1016]" />
        )}

        <img
          src={POSTER_SRC}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-[1000ms] ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          poster={POSTER_SRC}
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
