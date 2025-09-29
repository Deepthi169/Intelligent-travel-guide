import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.js';
import * as turf from '@turf/turf';
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

// Your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiYWdpbGVzcyIsImEiOiJjbWZzZTV3MjAwNTc5MmlxdmJ2bXc4eWNhIn0.Bl8NirUpFwrh-uGJdSn6Qw";

function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const directionsControl = useRef(null);
  const geolocateControl = useRef(null);
  
  const [routeReady, setRouteReady] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [routeData, setRouteData] = useState({ distance: null, duration: null });

  const deviationData = useRef({
    journeyStarted: false,
    isDeviated: false,
    routeLine: null,
  });

  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.7047, 10.7905],
      zoom: 12,
    });

    map.current.on('style.load', () => {
        map.current.addSource('mapbox-dem', {
            'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512, 'maxzoom': 14
        });
        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });

    directionsControl.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: { inputs: true, instructions: true, profileSwitcher: true, },
      placeholderDestination: "Choose destination",
    });
    
    map.current.addControl(directionsControl.current, 'top-left');
    
    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocateControl.current, 'top-right');
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // DELETED: The complex, manual button creation logic has been removed.
    
    const onRoute = (event) => {
      if (event.route && event.route.length > 0) {
        const route = event.route[0];
        deviationData.current.routeLine = route.geometry;
        deviationData.current.isDeviated = false;
        setRouteReady(true);
        setRouteData({ distance: route.distance, duration: route.duration });
      }
    };
    const onClear = () => {
      deviationData.current.routeLine = null;
      setRouteReady(false);
      setJourneyStarted(false);
      deviationData.current.journeyStarted = false;
      setRouteData({ distance: null, duration: null });
      const directionsContainer = document.querySelector('.mapboxgl-ctrl-directions');
      if (directionsContainer) directionsContainer.style.display = 'block';
    };

    const handleGeolocate = (position) => {
      if (!position.coords) return;

      const { journeyStarted, routeLine, isDeviated } = deviationData.current;
      if (!journeyStarted || !routeLine) return;

      const userLocation = turf.point([position.coords.longitude, position.coords.latitude]);
      const distanceOffRoute = turf.pointToLineDistance(userLocation, routeLine, { units: 'kilometers' });

      if (distanceOffRoute > 5 && !isDeviated) {
        deviationData.current.isDeviated = true;
        alert(`You are ${distanceOffRoute.toFixed(1)} km off the route. Consider re-routing.`);
      } else if (distanceOffRoute <= 5 && isDeviated) {
        deviationData.current.isDeviated = false;
      }
    };

    directionsControl.current.on('route', onRoute);
    directionsControl.current.on('clear', onClear);
    geolocateControl.current.on('geolocate', handleGeolocate);

    return () => {
      if (map.current && directionsControl.current) map.current.removeControl(directionsControl.current);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const setStartToCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser.');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        if (directionsControl.current) {
          directionsControl.current.setOrigin(coords);
          map.current.flyTo({ center: coords, zoom: 14 });
        }
      },
      () => alert('Unable to retrieve your location. Please ensure location services are enabled.')
    );
  };

  const handleStartJourney = () => {
    if (!routeReady) return;
    setJourneyStarted(true);
    deviationData.current.journeyStarted = true;
    
    if (geolocateControl.current) {
      geolocateControl.current.trigger();
    }
    
    const directionsContainer = document.querySelector('.mapboxgl-ctrl-directions');
    if (directionsContainer) directionsContainer.style.display = 'none';
    const originCoords = directionsControl.current.getOrigin().geometry.coordinates;
    map.current.flyTo({
      center: originCoords, zoom: 16, pitch: 60,
      bearing: map.current.getBearing(), speed: 1.2,
    });
  };

  const handleRecenter = () => {
    if (geolocateControl.current) {
      geolocateControl.current.trigger();
    }
  };
  
  const formatDistance = (meters) => {
    if (!meters) return '';
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours} hr `;
    if (minutes > 0 || hours === 0) result += `${minutes} min`;
    return result.trim();
  };

  const calculateArrivalTime = (durationInSeconds) => {
    if (!durationInSeconds) return '';
    const now = new Date();
    now.setSeconds(now.getSeconds() + durationInSeconds);
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formattedDistance = formatDistance(routeData.distance);
  const formattedDuration = formatDuration(routeData.duration);
  const arrivalTime = calculateArrivalTime(routeData.duration);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      
      {/* --- RE-ADDED: The "Use Current Location" button is now a standard React component --- */}
      {!journeyStarted && (
        <button
          onClick={setStartToCurrentLocation}
          style={{
            position: 'absolute',
            top: '100px',
            left: '10px',
            zIndex: 10,
            backgroundColor: 'white',
            color: '#333',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📍 Use Current Location as Start
        </button>
      )}

      {routeReady && !journeyStarted && (
        <button
          onClick={handleStartJourney}
          style={{
            position: 'absolute', bottom: '30px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10, padding: '12px 24px',
            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
            backgroundColor: '#4285F4', color: 'white', border: 'none',
            borderRadius: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Start Journey ({formattedDuration}, {formattedDistance})
        </button>
      )}

      {journeyStarted && (
        <div style={{
          position: 'absolute', bottom: '20px', left: '10px', right: '10px',
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '16px', zIndex: 10,
        }}>
          <div>
            <h2 style={{ color: '#1e8e3e', fontSize: '28px', fontWeight: 'bold', margin: 0, }}>
              {formattedDuration}
            </h2>
            <p style={{ color: '#5f6368', fontSize: '16px', margin: '4px 0 0', }}>
              {formattedDistance} &middot; {arrivalTime}
            </p>
          </div>
          <div style={{
            width: '40px', height: '5px', backgroundColor: '#d8d8d8',
            borderRadius: '3px', margin: '16px auto 0',
          }} />
        </div>
      )}
      
      {journeyStarted && (
        <button
          onClick={handleRecenter}
          style={{
            position: 'absolute', bottom: '180px', right: '20px', zIndex: 10,
            backgroundColor: 'white', border: 'none', borderRadius: '50%',
            width: '50px', height: '50px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer', display: 'flex', justifyContent: 'center',
            alignItems: 'center', fontSize: '24px'
          }}
        >
          🎯
        </button>
      )}

      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      />
    </div>
  );
}

export default MapComponent;