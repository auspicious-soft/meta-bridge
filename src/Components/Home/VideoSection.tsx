import { useLayoutEffect, useRef, useState } from "react";
import ContactButton from "../ContactButton";

// ✅ Use public folder paths for better performance (CDN / caching)
const DESKTOP_VIDEO = "/metabridge-video-optimized.mp4";
const MOBILE_VIDEO = "/metabridge-video-mobile-optimized.mp4";
const POSTER_DESKTOP = "/metabridge-video-poster.png";
const POSTER_MOBILE = "/metabridge-poster-mobile.png"; 

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
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const video =
      window.innerWidth >= 768
        ? desktopVideoRef.current
        : mobileVideoRef.current;

    if (!container || !video) return;

    let rafId: number | null = null;
    let didMarkReady = false;

    const markReady = () => {
      if (didMarkReady) return;
      didMarkReady = true;
      setIsReady((prev) => prev || true);
    };

    const updateVideoTime = () => {
      if (!video || video.readyState < 2) return;
      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, scrollTop / Math.max(1, scrollRange))
      );
      const target = progress * (video.duration || 0);
      const diff = target - video.currentTime;

      if (Math.abs(diff) > 0.02) {
        video.currentTime += diff * 0.2;
        rafId = requestAnimationFrame(updateVideoTime);
      } else {
        rafId = null;
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateVideoTime);
    };

    const canRenderFirstFrame = () => {
      try {
        const buffered = video.buffered;
        if (buffered && buffered.length > 0) {
          const end = buffered.end(buffered.length - 1);
          if (end > 0.05) return true;
        }
        if (video.readyState >= 2) return true;
      } catch {
        // ignore
      }
      return false;
    };

    const attemptPlayShort = async (ms = 150) => {
      try {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
        await new Promise((res) => setTimeout(res, ms));
        video.pause();
        video.currentTime = 0;
        markReady();
        return true;
      } catch {
        return false;
      }
    };

    const onLoadedMeta = async () => {
      const ok = await attemptPlayShort(150);
      if (!ok && canRenderFirstFrame()) markReady();
    };

    const onCanPlay = () => markReady();
    const onProgress = () => {
      if (canRenderFirstFrame()) markReady();
    };

    const onUserGesture = async () => {
      const ok = await attemptPlayShort(100);
      if (ok) markReady();
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("progress", onProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });
    window.addEventListener("click", onUserGesture, { once: true });

    if (canRenderFirstFrame()) markReady();

    return () => {
      cancelAnimationFrame(rafId ?? 0);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("progress", onProgress);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
    };
  }, [isReady]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* ✅ Keep gradient visible until video fully ready */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#12202c] to-[#0b1016]" />
        )}

        {/* ✅ Posters */}
        <img
          src={POSTER_DESKTOP}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 hidden md:block ${isReady ? "opacity-0" : "opacity-100"
            }`}
        />
        <img
          src={POSTER_MOBILE}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 block md:hidden ${isReady ? "opacity-0" : "opacity-100"
            }`}
        />

        {/* ✅ Video layers - fade in only once */}
        <video
          ref={desktopVideoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block video-layer ${isReady ? "opacity-100" : "opacity-0"
            }`}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          poster={POSTER_DESKTOP}
          src={DESKTOP_VIDEO}
        />

        <video
          ref={mobileVideoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none block md:hidden video-layer ${isReady ? "opacity-100" : "opacity-0"
            }`}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          poster={POSTER_MOBILE}
          src={MOBILE_VIDEO}
        />

        {/* ✅ Overlay text fixed above video layer */}
        <div
          className="absolute inset-0 z-30 flex flex-col justify-center items-center pt-[77px] px-6"
        >
          <div className="max-w-[900px] mx-auto text-center">
            <h6 className="text-[#f1f5f8] text-sm md:text-base uppercase mb-3 md:mb-5">
              {t.heroSubTitle} ss
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
