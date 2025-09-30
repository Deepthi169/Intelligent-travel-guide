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

// // src/MapComponent.js
// import React, { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// // 🔑 Replace with your real Mapbox access token from https://account.mapbox.com
// mapboxgl.accessToken = "pk.eyJ1IjoiYWdpbGVzcyIsImEiOiJjbWZzZTV3MjAwNTc5MmlxdmJ2bXc4eWNhIn0.Bl8NirUpFwrh-uGJdSn6Qw";

// const sampleStatuses = [
//   {
//     id: 1,
//     text: "At the Rockfort Temple! 🙏",
//     coords: [78.6987, 10.8274],
//   },
//   {
//     id: 2,
//     text: "Shopping time 🛍️",
//     coords: [78.7150, 10.7650],
//   },
//   {
//     id: 3,
//     text: "Grabbing a coffee ☕",
//     coords: [78.6830, 10.8080],
//   },
// ];

// function MapComponent() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [statusMessage, setStatusMessage] = useState("Requesting your location...");
//   const [currentUserLocation, setCurrentUserLocation] = useState(null);
//   const [statuses, setStatuses] = useState(sampleStatuses);
//   const [newStatusText, setNewStatusText] = useState("");

//   // Initialize map
//   useEffect(() => {
//     if (map.current) return; // prevent re-initializing

//     const initializeMap = (centerCoords) => {
//       setCurrentUserLocation(centerCoords);
//       map.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: "mapbox://styles/mapbox/streets-v12",
//         center: centerCoords,
//         zoom: 12,
//       });

//       map.current.addControl(new mapboxgl.NavigationControl());

//       // User location marker
//       const userMarkerEl = document.createElement("div");
//       userMarkerEl.className =
//         "w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow";
//       new mapboxgl.Marker(userMarkerEl).setLngLat(centerCoords).addTo(map.current);

//       setStatusMessage(null);
//     };

//     // Handle geolocation
//     if (!navigator.geolocation) {
//       setStatusMessage("Geolocation not supported. Defaulting to Tiruchirappalli.");
//       initializeMap([78.7047, 10.7905]);
//     } else {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { longitude, latitude } = position.coords;
//           initializeMap([longitude, latitude]);
//         },
//         (error) => {
//           setStatusMessage(
//             `Could not get location: ${error.message}. Defaulting to Tiruchirappalli.`
//           );
//           initializeMap([78.7047, 10.7905]);
//         }
//       );
//     }
//   }, []);

//   // Render status markers
//   useEffect(() => {
//     if (!map.current) return;

//     statuses.forEach((status) => {
//       if (document.getElementById(`status-${status.id}`)) return;

//       const el = document.createElement("div");
//       el.id = `status-${status.id}`;
//       el.className = "flex flex-col items-center pointer-events-none";

//       el.innerHTML = `
//         <div class="bg-white/90 px-3 py-2 rounded-2xl shadow-md mb-1.5 text-sm font-medium text-gray-800 pointer-events-auto">
//           ${status.text}
//         </div>
//         <div class="w-10 h-10 bg-[#fffc00] border-2 border-white rounded-full flex items-center justify-center text-2xl shadow-md">
//           👤
//         </div>
//       `;

//       new mapboxgl.Marker(el).setLngLat(status.coords).addTo(map.current);
//     });
//   }, [statuses]);

//   // Handle posting new status
//   const handlePostStatus = () => {
//     if (!newStatusText.trim() || !currentUserLocation) return;

//     const newStatus = {
//       id: Date.now(),
//       text: newStatusText,
//       coords: currentUserLocation,
//     };

//     setStatuses((prev) => [...prev, newStatus]);
//     setNewStatusText("");
//   };

//   return (
//     <div className="relative w-full h-screen">
//       {/* Status message (top center) */}
//       {statusMessage && (
//         <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-lg shadow-md z-10">
//           {statusMessage}
//         </div>
//       )}

//       {/* Map container */}
//       <div
//         ref={mapContainer}
//         className="absolute top-0 bottom-0 w-full h-full"
//         style={{ minHeight: "100vh" }}
//       />

//       {/* Status input (bottom center) */}
//       {currentUserLocation && (
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center bg-white p-2 rounded-full shadow-lg w-4/5 max-w-sm">
//           <input
//             type="text"
//             className="flex-grow bg-transparent border-none outline-none text-base px-3"
//             placeholder="What are you up to?"
//             value={newStatusText}
//             onChange={(e) => setNewStatusText(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handlePostStatus()}
//           />
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-full cursor-pointer transition-colors duration-200"
//             onClick={handlePostStatus}
//           >
//             Post
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MapComponent;
