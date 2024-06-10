// Import necessary React hooks and styles
import React, { useState } from "react";
import "./arcgis-map.css";

// Define the ArcgisMap component
const ArcgisMap = () => {
    // State variable for the ArcGIS Experience URL
    const [appUrl, setAppUrl] = useState("https://experience.arcgis.com/experience/e0855e0eeb8d4e4abd4e742e8f6a922a/"); // default map ID

    // Render the ArcgisMap component
    return (
        <div className="map-container">
            {/* Embed ArcGIS Experience using an iframe */}
            <iframe
                src={appUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="ArcGIS Experience Builder"
            ></iframe>
        </div>
    );
};

export default ArcgisMap;
