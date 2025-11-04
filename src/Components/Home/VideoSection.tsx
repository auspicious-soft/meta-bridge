import { useLayoutEffect, useRef, useState } from "react";
import ContactButton from "../ContactButton";

const DESKTOP_VIDEO_SRC = "/metabridge-video.mp4";
const MOBILE_VIDEO_SRC = "/metabridge-video-mobile.mp4";
const DESKTOP_POSTER_SRC = "/metabridge-video-poster.png";
const MOBILE_POSTER_SRC = "/metabridge-video-mobile-poster.png";

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

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
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [posterSrc, setPosterSrc] = useState("");

  // ✅ Set device-specific assets
  useLayoutEffect(() => {
    if (isMobileDevice()) {
      setVideoSrc(MOBILE_VIDEO_SRC);
      setPosterSrc(MOBILE_POSTER_SRC);
    } else {
      setVideoSrc(DESKTOP_VIDEO_SRC);
      setPosterSrc(DESKTOP_POSTER_SRC);
    }
  }, []);

  // ✅ Lazy load video once in viewport
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // ✅ Scroll scrub logic
  useLayoutEffect(() => {
    if (!shouldLoad) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId: number;
    let scrollProgress = 0;
    let targetProgress = 0;
    let currentTime = 0;
    let lastTimeUpdate = 0;
    let isUserActivated = false;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const onScroll = () => {
      const scrollTop = window.scrollY - container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const newProgress = Math.min(
        1,
        Math.max(0, scrollTop / Math.max(1, scrollRange))
      );
      targetProgress = newProgress;
    };

    const update = (timestamp: number) => {
      const velocity = Math.abs(targetProgress - scrollProgress);
      const smoothing =
        velocity > 0.05 ? 0.25 : velocity > 0.01 ? 0.18 : 0.12;

      scrollProgress = lerp(scrollProgress, targetProgress, smoothing);

      if (video.readyState >= 2 && video.duration) {
        const targetTime = scrollProgress * video.duration;
        currentTime = lerp(currentTime, targetTime, 0.25);

        if (timestamp - lastTimeUpdate > 16) {
          const diff = Math.abs(video.currentTime - currentTime);
          if (diff > 0.03) {
            try {
              video.currentTime = currentTime;
              lastTimeUpdate = timestamp;
            } catch {}
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

    video.addEventListener("loadeddata", markReady);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });

    onScroll();
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };
  }, [shouldLoad, videoSrc]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-[#0b1016] via-[#203446] to-[#0b1118]" />
        )}

        <img
          src={posterSrc}
          alt="Metabridge background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {shouldLoad && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
            preload="metadata"
            muted
            playsInline
            disablePictureInPicture
            poster={posterSrc}
            src={videoSrc}
            style={{
              transform: "translateZ(0)",
              willChange: "auto",
            }}
          />
        )}

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
