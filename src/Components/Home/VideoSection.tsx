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

    let rafId: number;
    let scrollProgress = 0;
    let targetProgress = 0;
    let currentTime = 0;
    let lastTimeUpdate = 0;
    let isUserActivated = false;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0; // Track scroll direction

    // Improved lerp function with configurable easing
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
    
    // Custom easing function for smoother transitions
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollTop = currentScrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      
      // Calculate scroll direction
      scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
      lastScrollY = currentScrollY;
      
      // Calculate target progress
      const newTargetProgress = Math.min(
        1,
        Math.max(0, scrollTop / Math.max(1, scrollRange))
      );
      
      // Apply easing to the target progress for smoother transitions
      const progressDiff = Math.abs(newTargetProgress - targetProgress);
      if (progressDiff > 0.01) {
        targetProgress = lerp(targetProgress, newTargetProgress, 0.3);
      } else {
        targetProgress = newTargetProgress;
      }
    };

    const update = (timestamp: number) => {
      // Calculate velocity with direction consideration
      const velocity = Math.abs(targetProgress - scrollProgress);
      const isScrollingInDirection = (targetProgress - scrollProgress) * scrollDirection >= 0;
      
      // Dynamic smoothing based on scroll speed and direction
      let smoothing;
      if (velocity > 0.05) {
        smoothing = isScrollingInDirection ? 0.25 : 0.35;
      } else if (velocity > 0.01) {
        smoothing = isScrollingInDirection ? 0.18 : 0.25;
      } else {
        smoothing = isScrollingInDirection ? 0.12 : 0.18;
      }
      
      // Apply easing to the interpolation
      const easedProgress = easeInOutCubic(scrollProgress);
      const easedTarget = easeInOutCubic(targetProgress);
      const easedNewProgress = lerp(easedProgress, easedTarget, smoothing);
      
      // Convert back from eased space
      scrollProgress = easedNewProgress;

      if (video.readyState >= 2 && video.duration) {
        const targetTime = scrollProgress * video.duration;
        
        // Adjust time interpolation based on direction
        const timeSmoothing = isScrollingInDirection ? 0.3 : 0.4;
        currentTime = lerp(currentTime, targetTime, timeSmoothing);

        // Update video time more frequently for smoother playback
        if (timestamp - lastTimeUpdate > 8) { // Reduced from 16ms to 8ms
          const diff = Math.abs(video.currentTime - currentTime);
          if (diff > 0.01) { // Reduced threshold for more frequent updates
            try {
              // Ensure we're not trying to set a time outside the video duration
              const clampedTime = Math.max(0.01, Math.min(video.duration - 0.01, currentTime));
              video.currentTime = clampedTime;
              lastTimeUpdate = timestamp;
            } catch (e) {
              console.warn("Error setting video time:", e);
            }
          }
        }
      }

      rafId = requestAnimationFrame(update);
    };

    const markReady = () => setIsReady(true);

    const tryActivateVideo = async () => {
      if (isUserActivated) return;
      isUserActivated = true;
      try {
        await video.play();
        video.pause();
        video.currentTime = 0.01;
        await video.play();
        video.pause();
        video.currentTime = 0;
        markReady();
      } catch {
        console.warn("Autoplay blocked until user gesture");
      }
    };

    const onUserGesture = async () => {
      await tryActivateVideo();
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };

    // Preload the video more aggressively
    video.load();
    
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplaythrough", markReady); // Additional event listener
    window.addEventListener("scroll", onScroll, { passive: true }); // Use passive listener
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });

    onScroll();
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplaythrough", markReady);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Gradient background while loading */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#203446] to-[#0b1118]" />
        )}

        {/* Poster fallback */}
        <img
          src={POSTER_SRC}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Smooth scroll-controlled video */}
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
          style={{
            transform: "translateZ(0)",
            willChange: "auto",
          }}
        />

        {/* Overlay text */}
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