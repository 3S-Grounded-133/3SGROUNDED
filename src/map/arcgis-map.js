import React, { useState } from "react";
import "./arcgis-map.css";

const ArcgisMap = () => {
    const [appUrl, setAppUrl] = useState("https://experience.arcgis.com/experience/e0855e0eeb8d4e4abd4e742e8f6a922a/"); // default map ID

    return (
        <div className="map-container">
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
