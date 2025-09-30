import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as turf from '@turf/turf';
import "mapbox-gl/dist/mapbox-gl.css";

import StoryViewer from './components/StoryViewer';
import { storiesData } from './storiesData';

// ADD YOUR ACCESS TOKEN HERE
mapboxgl.accessToken = "pk.eyJ1IjoiYWdpbGVzcyIsImEiOiJjbWZzZTV3MjAwNTc5MmlxdmJ2bXc4eWNhIn0.Bl8NirUpFwrh-uGJdSn6Qw";

function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const directionsControl = useRef(null);
  const geoWatchId = useRef(null);

  const [statusMessage, setStatusMessage] = useState('Requesting your location...');
  const [userLocation, setUserLocation] = useState(null);
  const [activeStory, setActiveStory] = useState(null);

  const [currentRoute, setCurrentRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState({
    instruction: "Starting route...",
    distance: 0,
    time: 0,
  });

  // --- MAP INITIALIZATION AND GEOLOCATION ---
  useEffect(() => {
    if (map.current) return;

    const initializeMap = (centerCoords) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: centerCoords,
        zoom: 13,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      directionsControl.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: { instructions: true },
        interactive: !isNavigating,
      });
      map.current.addControl(directionsControl.current, 'top-left');

      directionsControl.current.on('route', (e) => {
        if (e.route && e.route.length > 0) {
          const route = e.route[0];
          const routeLine = turf.lineString(route.geometry.coordinates);
          setCurrentRoute({ ...route, line: routeLine });
        }
      });
      
      directionsControl.current.on('clear', () => {
        setCurrentRoute(null);
        setIsNavigating(false);
      });

      userMarker.current = new mapboxgl.Marker({ color: '#007cbf' })
        .setLngLat(centerCoords)
        .addTo(map.current);
        
      setStatusMessage(null);
    };

    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported. Defaulting to Tiruchirappalli.");
      initializeMap([78.7047, 10.7905]);
      return;
    }

    geoWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const newCoords = [longitude, latitude];
        setUserLocation(newCoords);

        if (!map.current) {
          initializeMap(newCoords);
        } else {
          userMarker.current.setLngLat(newCoords);
        }
      },
      (error) => {
        setStatusMessage(`Location error: ${error.message}. Defaulting to Tiruchirappalli.`);
        if (!map.current) initializeMap([78.7047, 10.7905]);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      if (geoWatchId.current) navigator.geolocation.clearWatch(geoWatchId.current);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isNavigating]);


  // --- NAVIGATION LOGIC ---
  useEffect(() => {
    if (!isNavigating || !currentRoute || !userLocation) return;
    
    const userPoint = turf.point(userLocation);
    const snapped = turf.nearestPointOnLine(currentRoute.line, userPoint, { units: 'meters' });
    userMarker.current.setLngLat(snapped.geometry.coordinates);

    let currentStepIndex = 0;
    let minDistance = Infinity;

    currentRoute.legs[0].steps.forEach((step, index) => {
        const stepPoint = turf.point(step.maneuver.location);
        const distance = turf.distance(snapped, stepPoint, { units: 'meters' });
        if (distance < minDistance) {
            minDistance = distance;
            currentStepIndex = index;
        }
    });
    
    const upcomingStepIndex = currentStepIndex < currentRoute.legs[0].steps.length - 1 ? currentStepIndex + 1 : currentStepIndex;
    const upcomingStep = currentRoute.legs[0].steps[upcomingStepIndex];

    const remainingSteps = currentRoute.legs[0].steps.slice(upcomingStepIndex);
    const remainingDistance = remainingSteps.reduce((acc, step) => acc + step.distance, 0);
    const remainingDuration = remainingSteps.reduce((acc, step) => acc + step.duration, 0);

    setNavigationInfo({
        instruction: upcomingStep.maneuver.instruction,
        distance: (remainingDistance / 1000).toFixed(2),
        time: Math.round(remainingDuration / 60),
    });

  }, [isNavigating, userLocation, currentRoute]);


  // --- UI HANDLERS ---
  const handleFocusUser = () => {
    if (map.current && userLocation) {
      map.current.flyTo({ center: userLocation, zoom: 15, speed: 1.5 });
    }
  };

  const handleStartJourney = () => {
    if (currentRoute) {
      setIsNavigating(true);
      const directionsElement = document.querySelector('.mapboxgl-ctrl-directions');
      if (directionsElement) directionsElement.style.display = 'none';
    }
  };

  const handleEndJourney = () => {
    setIsNavigating(false);
    setCurrentRoute(null);
    if(directionsControl.current){
        directionsControl.current.clearOrigin();
        directionsControl.current.clearDestination();
    }
    const directionsElement = document.querySelector('.mapboxgl-ctrl-directions');
    if (directionsElement) directionsElement.style.display = 'block';
  };

  return (
    <div className="relative w-full h-screen">
      <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
      
      {/* --- Story Bar --- */}
      <div className="absolute top-[15px] left-0 right-0 z-20 overflow-x-auto whitespace-nowrap p-2 scrollbar-hide">
        {storiesData.map((story) => (
          <div key={story.id} className="inline-block text-center mx-2 cursor-pointer" onClick={() => setActiveStory(story)}>
            <img src={story.profilePic} alt={story.username} className="w-[60px] h-[60px] rounded-full border-4 border-pink-500 p-0.5 bg-white" />
            <p className="text-xs text-gray-700 font-medium mt-1">{story.username}</p>
          </div>
        ))}
      </div>
      
      {/* --- Status Message --- */}
      {statusMessage && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white py-2 px-5 rounded-lg shadow-lg z-30">
          {statusMessage}
        </div>
      )}

      <div ref={mapContainer} className="absolute inset-0 w-full" />
      
      {/* --- UI Controls --- */}
      <div className="absolute bottom-8 right-5 z-10 flex flex-col gap-3">
        <button onClick={handleFocusUser} className="w-12 h-12 flex justify-center items-center text-2xl bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors" title="Focus on your location">
          📍
        </button>
        {currentRoute && !isNavigating && (
          <button onClick={handleStartJourney} className="w-12 h-12 flex justify-center items-center text-2xl bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors" title="Start Journey">
             ▶️
          </button>
        )}
      </div>

      {/* --- Navigation Panel --- */}
      {isNavigating && currentRoute && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10 bg-white p-4 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{navigationInfo.instruction}</h3>
            <p className="text-gray-600">
                Next turn in <strong className="text-gray-900">{navigationInfo.distance} km</strong>
                {' '}| ETA: <strong className="text-gray-900">{navigationInfo.time} min</strong>
            </p>
            <button onClick={handleEndJourney} className="mt-4 py-2 px-5 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition-colors">
              End Journey
            </button>
        </div>
      )}
    </div>
  );
}

export default MapComponent;