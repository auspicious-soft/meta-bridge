import React, { useRef, useEffect, useState } from 'react';
import OutputOne from "../../Assets/output-1.mp4" 
import OutputTwo from "../../Assets/output-2.mp4" 

const ScrollVideoHero = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const videoStartRef = useRef(null);
  const videoSecondRef = useRef(null);
  const firstTextRef = useRef(null);
  const introRef = useRef(null);
  const finalImgRef = useRef(null);
  const videoContainerRef = useRef(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !sectionRef.current) return;
      
      // Set scrolling to true
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 100); // 100ms after scroll stops
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Check if we should pin the section
      const shouldPin = containerRect.top <= 0 && containerRect.bottom > windowHeight;
      setIsPinned(shouldPin);
      
      // Calculate scroll progress through the pinned section
      let progress = 0;
      if (containerRect.top <= 0) {
        const scrolledDistance = -containerRect.top;
        const totalScrollDistance = containerHeight - windowHeight;
        progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollDistance));
      }
      
      setScrollProgress(progress);
      
      // Determine which section should be visible based on scroll progress
      if (progress < 0.25) {
        setCurrentSection(0); // Video section
      } else if (progress < 0.6) {
        setCurrentSection(1); // Text overlay
      } else {
        setCurrentSection(2); // iPad section
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Handle video scrubbing based on scroll progress (NO AUTOPLAY)
    if (videoStartRef.current) {
      const video = videoStartRef.current;
      if (currentSection === 0 || (currentSection === 1 && scrollProgress < 0.5)) {
        // Set video time based on scroll progress (0 to 0.5 progress = 0 to video duration)
        const videoProgress = Math.min(scrollProgress / 0.5, 1);
        const targetTime = videoProgress * video.duration;
        
        // Only scrub the video timeline, don't play automatically
        if (!isNaN(targetTime) && Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }
        
        // Always pause - we only want scrubbing, not playing
        if (!video.paused) {
          video.pause();
        }
      } else {
        video.pause();
      }
    }

    if (videoSecondRef.current) {
      const video = videoSecondRef.current;
      if (currentSection === 2) {
        // Set video time based on scroll progress in iPad section (0.6 to 1.0 progress)
        const videoProgress = Math.max(0, (scrollProgress - 0.6) / 0.4);
        const targetTime = videoProgress * video.duration;
        
        // Only scrub the video timeline, don't play automatically
        if (!isNaN(targetTime) && Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }
        
        // Always pause - we only want scrubbing, not playing
        if (!video.paused) {
          video.pause();
        }
      } else {
        video.pause();
      }
    }
  }, [currentSection, scrollProgress, isScrolling, isPinned]);

  // Calculate transform values based on scroll
  const getVideoContainerTransform = () => {
    if (currentSection < 2) return 'translate(0px, 0px) scale(3.65)';
    
    const scaleProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.4));
    const scale = 3.65 - (scaleProgress * 0.65); // Scale from 3.65 to 3
    return `translate(0px, 0px) scale(${scale})`;
  };

  const getFinalImgOpacity = () => {
    if (scrollProgress < 0.85) return 0;
    return Math.min(0.99, (scrollProgress - 0.85) / 0.15);
  };

  return (
    <div className="relative">
      {/* Pinned Container - This creates the scroll space */}
      <div 
        ref={containerRef}
        style={{ height: '400vh' }} // This creates the scroll distance
        className="relative"
      >
        <section
          ref={sectionRef}
          className={`w-full h-screen bg-black overflow-hidden transition-all duration-100 ${
            isPinned ? 'fixed top-0 left-0' : 'absolute top-0 left-0'
          }`}
          style={{ zIndex: 10 }}
        >
        {/* First Video Section */}
        <div 
          className="absolute inset-0 w-full h-full z-20"
          style={{
            opacity: currentSection === 0 ? 1 : (currentSection === 1 ? 0.3 : 0),
            visibility: currentSection <= 1 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease'
          }}
        >
          <video
            ref={videoStartRef}
            className="object-cover object-center w-full h-full"
            muted
            playsInline
            preload="metadata"
            style={{ width: '100%', display: 'block' }}
          >
            <source src={OutputOne} type="video/mp4" />
          </video>
        </div>

        {/* Text Overlay Section */}
        <div 
          ref={firstTextRef}
          className="relative z-40 w-full h-screen flex items-center justify-center"
          style={{
            opacity: currentSection === 1 ? 1 : 0,
            visibility: currentSection === 1 ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease'
          }}
        >
          <div className="text-center text-white max-w-[700px] space-y-8 px-4">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                We Handle<br />the Sh*t you Hate
              </h1>
              <p className="text-gray-300 text-lg lg:text-xl">
                And we do it faster, smarter, and without breaking.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <a 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                href="#contact"
              >
                Scale with real infrastructure
              </a>
            </div>
          </div>
        </div>

        {/* iPad Section */}
        <div 
          ref={introRef}
          className="absolute inset-0 z-40 w-full h-screen bg-white"
          style={{
            opacity: currentSection === 2 ? 1 : 0,
            visibility: currentSection === 2 ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease'
          }}
        >
          <div className="container mx-auto text-center h-screen flex flex-col justify-center items-center space-y-6 px-4">
            <h1 className="text-2xl lg:text-4xl font-bold mx-auto max-w-4xl leading-tight">
              We are the secret partner that{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                brands and advertisers
              </span>{' '}
              use to achieve the same performance as multinational companies.
            </h1>
            
            <div 
              ref={videoContainerRef}
              className="videoContainer relative max-w-[600px] w-full origin-center"
              style={{
                transform: getVideoContainerTransform(),
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* iPad Frame */}
              <div className="w-full bg-gray-800 rounded-[2rem] p-2 shadow-2xl">
                <div className="bg-black rounded-[1.5rem] overflow-hidden relative aspect-[4/3]">
                  <video
                    ref={videoSecondRef}
                    className="w-full h-full object-cover object-center z-20"
                    muted
                    playsInline
                    preload="metadata"
                    style={{ width: '100%', display: 'block' }}
                  >
                    <source src={OutputTwo} type="video/mp4" />
                  </video>
                  
                  {/* Final Image Overlay */}
                  <div 
                    ref={finalImgRef}
                    className="z-40 h-full w-full absolute top-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center"
                    style={{
                      opacity: getFinalImgOpacity(),
                      visibility: getFinalImgOpacity() > 0 ? 'visible' : 'hidden'
                    }}
                  >
                    <div className="text-white text-center p-8">
                      <h2 className="text-2xl font-bold mb-4">Dashboard Preview</h2>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/20 p-3 rounded">Revenue: $2.4M</div>
                        <div className="bg-white/20 p-3 rounded">Conversion: 12.4%</div>
                        <div className="bg-white/20 p-3 rounded">Traffic: 450K</div>
                        <div className="bg-white/20 p-3 rounded">ROI: 340%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <a 
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              href="#contact"
            >
              Talk with us
            </a>
          </div>
        </div>
      </section>
      </div>
      
      {/* Content after the hero section */}
      <div className="relative z-20 bg-white min-h-screen p-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Content continues here...</h2>
          <p className="text-gray-600 mb-4">
            This section demonstrates that the scroll-triggered video hero works with regular content flow.
          </p>
          <p className="text-gray-600">
            The hero section is fixed and transitions through different states as you scroll through the 300vh space above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoHero;