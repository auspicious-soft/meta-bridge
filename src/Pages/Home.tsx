// import ChooseMetabridgeSection from "../Components/Home/ChooseMetabridgeSection";
// import EveryStep from "../Components/Home/EveryStepSection";
// import ImagePinnedSection from "../Components/Home/ImagePinnedSection";
// import MetaBridgeGridSection from "../Components/Home/MetaBridgeGridSection";
// import TabSection from "../Components/Home/TabSection";
// import TailorMadeSection from "../Components/Home/TailorMadeSection";
// import VideoSection from "../Components/Home/VideoSection";

// import useDetectCountry from "../Hooks/useDetectCountry";
// import translations from "../translations";


// const Home = () => {
//   const country = useDetectCountry();
//   const lang: "en" | "it" = country === "IT" ? "it" : "en";
//   const t = { ...translations[lang], lang };
  
//   return (
//     <>
//       <VideoSection t={t} />
//       <ChooseMetabridgeSection t={t} />
//       <TabSection t={t} />
//       <EveryStep t={t} />
//       <MetaBridgeGridSection t={t} />
//       <ImagePinnedSection t={t} />
//       <TailorMadeSection t={t} />
//     </>
//   );
// }

// export default Home; 

import { useEffect, useState } from "react";
import { preloadVideo } from "../utils/videoPreloader";
import ChooseMetabridgeSection from "../Components/Home/ChooseMetabridgeSection";
import EveryStep from "../Components/Home/EveryStepSection";
import ImagePinnedSection from "../Components/Home/ImagePinnedSection";
import MetaBridgeGridSection from "../Components/Home/MetaBridgeGridSection";
import TabSection from "../Components/Home/TabSection";
import TailorMadeSection from "../Components/Home/TailorMadeSection";
import VideoSection from "../Components/Home/VideoSection";
import useDetectCountry from "../Hooks/useDetectCountry";
import translations from "../translations";

const DESKTOP_VIDEO_SRC = "/metabridge-video.mp4";

const Home = () => {
  const country = useDetectCountry();
  const lang: "en" | "it" = country === "IT" ? "it" : "en";
  const t = { ...translations[lang], lang };
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    preloadVideo(DESKTOP_VIDEO_SRC)
      .then(() => setIsVideoReady(true))
      .catch(() => setIsVideoReady(true)); // fallback
  }, []);

  if (!isVideoReady) {
    // Optional: loading screen or poster
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading Metabridge experience...
      </div>
    );
  }

  return (
    <>
      <VideoSection t={t} />
      <ChooseMetabridgeSection t={t} />
      <TabSection t={t} />
      <EveryStep t={t} />
      <MetaBridgeGridSection t={t} />
      <ImagePinnedSection t={t} />
      <TailorMadeSection t={t} />
    </>
  );
};

export default Home;

