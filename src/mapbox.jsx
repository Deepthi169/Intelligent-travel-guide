import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYWdpbGVzcyIsImEiOiJjbWZzZTV3MjAwNTc5MmlxdmJ2bXc4eWNhIn0.Bl8NirUpFwrh-uGJdSn6Qw";

function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [statusMessage, setStatusMessage] = useState('Requesting your location...');

  useEffect(() => {
    if (map.current) return;

    const initializeMap = (centerCoords) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: centerCoords,
        zoom: 13,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());

      // Add Directions control from the global window object
      if (window.MapboxDirections) {
        const directions = new window.MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving',
        });
        map.current.addControl(directions, 'top-left');
      } else {
        setStatusMessage("Directions plugin failed to load.");
      }

      // Add a marker at the user's location
      new mapboxgl.Marker()
        .setLngLat(centerCoords)
        .addTo(map.current);

      setStatusMessage(null);
    };

    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser. Defaulting to Tiruchirappalli.");
      initializeMap([78.7047, 10.7905]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        initializeMap([longitude, latitude]);
      },
      (error) => {
        setStatusMessage(`Could not get location: ${error.message}. Defaulting to Tiruchirappalli.`);
        initializeMap([78.7047, 10.7905]);
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {statusMessage && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1
        }}>
          {statusMessage}
        </div>
      )}
      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      />
    </div>
  );
}

export default MapComponent;