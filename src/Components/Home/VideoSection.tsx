import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/metabridge-video-14.mp4";
const POSTER_SRC = "/metabridge-video-poster.png";

// Placeholder ContactButton component
const ContactButton = ({ label }) => (
  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
    {label}
  </button>
);

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId: number;
    let currentTime = 0;
    let isUserActivated = false;

    const markReady = () => setIsReady(true);

    // --- Core animation loop (FIXED for smooth bidirectional scrolling) ---
    const updateVideoTime = () => {
      if (!video || video.readyState < 2 || !video.duration) {
        rafId = requestAnimationFrame(updateVideoTime);
        return;
      }

      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / Math.max(1, scrollRange)));

      // Calculate target time
      const targetTime = progress * video.duration;

      // Improved smoothing - works for both forward and backward
      const distance = targetTime - currentTime;
      const easeFactor = isMobile ? 0.25 : 0.18; // Faster on mobile for better performance
      currentTime += distance * easeFactor;

      // Update video current time with smooth transition
      if (Math.abs(video.currentTime - currentTime) > 0.001) {
        try {
          video.currentTime = currentTime;
        } catch {
          /* ignore Chrome pre-play restriction */
        }
      }

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
    };

    // --- Start loop ---
    rafId = requestAnimationFrame(updateVideoTime);
    
    // Better loading detection for mobile
    if (isMobile) {
      video.addEventListener("canplaythrough", markReady);
    } else {
      video.addEventListener("loadeddata", markReady);
    }
    
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplaythrough", markReady);
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Gradient background while loading */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#12202c] to-[#0b1016]">
            <div className="text-white text-sm animate-pulse">Loading...</div>
          </div>
        )}

        {/* Poster fallback */}
        <img
          src={POSTER_SRC}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video layer with mobile optimization */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-[1000ms] ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          preload={isMobile ? "metadata" : "auto"} // Load less data on mobile
          muted
          playsInline
          disablePictureInPicture
          poster={POSTER_SRC}
          src={VIDEO_SRC}
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
  );}