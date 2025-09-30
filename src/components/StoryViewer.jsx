import React, { useState, useEffect, useCallback } from 'react';

const StoryViewer = ({ story, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex >= story.images.length - 1) {
        onClose(); // Close when the last story finishes
        return prevIndex;
      }
      return prevIndex + 1;
    });
  }, [story, onClose]);

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  useEffect(() => {
    const timer = setTimeout(goToNext, 5000); // 5 seconds per image
    return () => clearTimeout(timer);
  }, [currentImageIndex, goToNext]);

  if (!story) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div
        className="relative w-[95%] max-w-sm h-[90%] max-h-[700px] bg-cover bg-center rounded-xl overflow-hidden flex flex-col"
        style={{ backgroundImage: `url(${story.images[currentImageIndex]})` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header & Progress --- */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex gap-1">
            {story.images.map((_, index) => (
              <div key={index} className="flex-grow h-[3px] bg-white/40 rounded-full">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: index < currentImageIndex ? '100%' : (index === currentImageIndex ? '100%' : '0%') }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center mt-3 text-white">
            <img src={story.profilePic} alt={story.username} className="w-9 h-9 rounded-full mr-3 border-2 border-white" />
            <span className="font-semibold">{story.username}</span>
          </div>
          <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={onClose}>&times;</button>
        </div>

        {/* --- Navigation --- */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 h-full cursor-pointer" onClick={goToPrev}></div>
          <div className="flex-1 h-full cursor-pointer" onClick={goToNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;