import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ location }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!location) return;

    const initializeMap = async () => {
      try {
        // Get coordinates from location name using OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          console.error('Location not found');
          return;
        }
        
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        
        if (!map.current) {
          // Initialize map if not already done
          map.current = L.map(mapContainer.current).setView([latitude, longitude], 10);
          
          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map.current);
        } else {
          // Just update the view if map already exists
          map.current.setView([latitude, longitude], 10);
        }
        
        // Update or add marker
        if (marker.current) {
          marker.current.setLatLng([latitude, longitude]);
        } else {
          marker.current = L.marker([latitude, longitude]).addTo(map.current);
        }
        
        // Add popup
        marker.current.bindPopup(`<h3>${location}</h3>`).openPopup();
        
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, [location]);

  return (
    <motion.div 
      className="map-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={mapContainer} className="map" />
    </motion.div>
  );
};

export default Map; 