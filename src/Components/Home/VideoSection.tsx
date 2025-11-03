import { useEffect, useRef, useState } from "react";
import ContactButton from "../ContactButton";

const DESKTOP_VIDEO = "/metabridge-video-optimized.mp4";
const POSTER_DESKTOP = "/metabridge-video-poster.png";

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
  const [isReady, setIsReady] = useState(false); // when true, show video and enable scrubbing

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let rafId: number | null = null;
    let didMarkReady = false;

    // Helper: mark ready once (idempotent)
    const markReady = () => {
      if (didMarkReady) return;
      didMarkReady = true;
      setIsReady(true);
    };

    // Update video currentTime based on scroll (scrubbing)
    const updateVideoTime = () => {
      if (!video || video.readyState < 2) return;
      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / Math.max(1, scrollRange)));
      const target = progress * (isFinite(video.duration) ? video.duration : 0);
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

    // Attempt to play briefly to force a frame; resolves if play succeeds
    const attemptPlayShort = async (ms = 150) => {
      try {
        // ensure we're at start
        video.currentTime = 0;
        const p = video.play();
        if (p && typeof p.then === "function") {
          await p;
        }
        // play succeeded — pause after a short moment to let browser paint
        await new Promise((res) => setTimeout(res, ms));
        video.pause();
        video.currentTime = 0;
        markReady();
        return true;
      } catch {
        return false;
      }
    };

    // Fallback: check buffered ranges to see if 0 second is buffered/can render
    const canRenderFirstFrame = () => {
      try {
        // If canplay event fired, browser should be able to render first frame.
        // Also use buffered end >= 0.1 as a heuristic
        const buffered = video.buffered;
        if (buffered && buffered.length > 0) {
          const end = buffered.end(buffered.length - 1);
          if (end > 0.05) return true;
        }
        // Lastly, check readyState
        if (video.readyState >= 2) return true; // HAVE_CURRENT_DATA
      } catch {
        // ignore
      }
      return false;
    };

    // Handler for built-in canplay/canplaythrough events
    const onCanPlay = () => {
      // If browser can play, it should be able to paint a frame
      markReady();
    };

    // Use loadedmetadata to know duration exists and try play
    const onLoadedMeta = async () => {
      // Try short play -> pause to force paint
      const ok = await attemptPlayShort(150);
      if (!ok) {
        // if autoplay blocked, but we have enough buffered data, show immediately
        if (canRenderFirstFrame()) {
          markReady();
        }
        // otherwise wait for canplay/progress or a user gesture
      }
    };

    // Touch unlock fallback (for iOS / browsers that block autoplay)
    const onUserGesture = async () => {
      // try to force a frame on user gesture
      const ok = await attemptPlayShort(100);
      if (ok) markReady();
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
    };

    // Progress event: if buffering enough, mark ready (useful in Chrome incognito)
    const onProgress = () => {
      if (canRenderFirstFrame()) {
        markReady();
      }
    };

    // Hook events
    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("progress", onProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });
    window.addEventListener("click", onUserGesture, { once: true });

    // If the video is already in a state to render (rare), mark ready
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
        {/* Poster image shown until video is ready */}
        <img
          src={POSTER_DESKTOP}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 block md:hidden ${
            isReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Video fades in once ready. Keep muted & playsInline */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={POSTER_DESKTOP}
          src={DESKTOP_VIDEO}
        />

        
        

        {/* Overlay text */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pt-[77px] px-6"
          style={{ zIndex: 2, pointerEvents: "none" }}
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
