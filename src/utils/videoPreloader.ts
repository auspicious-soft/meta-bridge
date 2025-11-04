// src/utils/videoPreloader.ts
let cachedVideo: HTMLVideoElement | null = null;
let videoLoaded = false;

export const preloadVideo = (src: string): Promise<HTMLVideoElement> => {
  if (videoLoaded && cachedVideo) return Promise.resolve(cachedVideo);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    video.oncanplaythrough = () => {
      cachedVideo = video;
      videoLoaded = true;
      resolve(video);
    };

    video.onerror = reject;
  });
};

export const getCachedVideo = () => cachedVideo;
