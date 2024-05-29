import React, { useState, useEffect } from "react";
import "./menu.css";

const testSendData = [
    { dataPoint: "", data: "", coordinates: "" },
];

const testRetrieveData = [
    { dataPoint: "Deventer park", data: "\n" +
            "Ground data collected in Deventer Park reveals a diverse soil composition, predominantly sandy loam with pockets of clay near the central pond. Moisture levels vary significantly, with higher readings in shaded areas, particularly under the dense canopy of oak trees. The park's topography includes gentle slopes towards the southern edge, facilitating natural drainage into the pond. Regular soil pH readings indicate slightly acidic conditions, ideal for the park's native plant species like heather and birch. Recent data highlights a need for increased irrigation in the northeastern sector, where moisture levels have consistently been low, potentially stressing the vegetation. This comprehensive ground data supports ongoing efforts to maintain the park's ecological balance and plan future landscaping projects.", coordinates: "40.7128° N, 74.0060° W" },
    { dataPoint: "Deventer Train Station", data: "Sandy", coordinates: "34.0522° N, 118.2437° W" },
    { dataPoint: "Zwolle University", data: "Delicious", coordinates: "51.5074° N, 0.1278° W" },
    { dataPoint: "Saxion Deventer", data: "Speedy", coordinates: "48.8566° N, 2.3522° E" },
    { dataPoint: "Saxion Enschede", data: "Bomarlicious", coordinates: "35.6895° N, 139.6917° E" },
    { dataPoint: "Happy Italy", data: "Sandy", coordinates: "34.0522° N, 118.2437° W" },
    { dataPoint: "Bagel's n Beans", data: "Delicious", coordinates: "51.5074° N, 0.1278° W" },
    { dataPoint: "Deventer Hospital", data: "Speedy", coordinates: "48.8566° N, 2.3522° E" },
    { dataPoint: "Gemeente Parking Garage", data: "Ground data collected for the new parking garage site reveals a foundational soil composition of compacted clay, providing a stable base for construction. Moisture levels are generally low, with some variability near the western edge due to an underground water table. The site's topography is predominantly flat, with a slight gradient towards the north to facilitate effective drainage. Soil pH measurements show neutral to slightly alkaline conditions, suitable for the planned concrete foundations and landscaping around the garage. Recent data also indicates a need for additional drainage systems in the southwestern corner to manage occasional water accumulation. This detailed ground data is essential for ensuring the structural integrity of the parking garage and guiding the design of efficient drainage and landscaping solutions.", coordinates: "35.6895° N, 139.6917° E" },
    { dataPoint: "Habbo Hotel", data: "Sandy", coordinates: "34.0522° N, 118.2437° W" },
    { dataPoint: "Zoo of Zoo's", data: "Delicious", coordinates: "51.5074° N, 0.1278° W" },
    { dataPoint: "Miaw miaw park", data: "Speedy", coordinates: "48.8566° N, 2.3522° E" },
    { dataPoint: "Doioioing Street", data: "Bomarlicious", coordinates: "35.6895° N, 139.6917° E" },
    { dataPoint: "Visserijstraat 1", data: "Sandy", coordinates: "34.0522° N, 118.2437° W" },
    { dataPoint: "Saxion Mental Hopital", data: "Delicious", coordinates: "51.5074° N, 0.1278° W" },
    { dataPoint: "Cinnamon shop", data: "Speedy", coordinates: "48.8566° N, 2.3522° E" },
    { dataPoint: "Worm City", data: "Bomarlicious", coordinates: "35.6895° N, 139.6917° E" },
    { dataPoint: "Lobotomy Sreet", data: "Sandy", coordinates: "34.0522° N, 118.2437° W" },
    { dataPoint: "Yowza Park", data: "Delicious", coordinates: "51.5074° N, 0.1278° W" },
    { dataPoint: "Oil Well of Enschede", data: "Speedy", coordinates: "48.8566° N, 2.3522° E" },
    { dataPoint: "Tony Montana Memorial", data: "Bomarlicious", coordinates: "35.6895° N, 139.6917° E" }
];

const Menu = () => {
    const [view, setView] = useState("send");
    const [sendDataRows, setSendDataRows] = useState(testSendData);
    const [retrieveDataRows, setRetrieveDataRows] = useState([]);
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.example.com/data"); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setRetrieveDataRows(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setRetrieveDataRows(testRetrieveData); // Fallback to sample data
            }
        };

        fetchData();
    }, []);

    const handleAddRow = () => {
        setSendDataRows([...sendDataRows, { dataPoint: "", data: "", coordinates: "" }]);
    };

    const handleRemoveRow = (index) => {
        const rows = [...sendDataRows];
        rows.splice(index, 1);
        setSendDataRows(rows);
    };

    const handleChange = (index, field, value) => {
        const rows = [...sendDataRows];
        rows[index][field] = value;
        setSendDataRows(rows);
    };

    const handleSend = async () => {
        for (const row of sendDataRows) {
            const payload = {
                dataPoint: row.dataPoint,
                data: row.data,
                coordinates: row.coordinates
            };
            try {
                const response = await fetch("https://api.example.com/send", { // Replace with your API endpoint
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log("Data sent successfully:", payload);

            } catch (error) {
                console.error("Error sending data:", error, payload);
            }
        }
        setSendDataRows([{ dataPoint: "", data: "", coordinates: "" }]);
    };

    const handleDataPointClick = (row) => {
        console.log("Data point clicked:", row.dataPoint);
        setPopup({ dataPoint: row.dataPoint, data: row.data, coordinates: row.coordinates });
    };

    const closePopup = () => {
        setPopup(null);
    };

    return (
        <div className="background">
            <div className="menu-header">
                <button className="header-button" onClick={() => setView("send")}>
                    Send
                </button>
                <button className="header-button" onClick={() => setView("retrieve")}>
                    Retrieve
                </button>
            </div>
            <div className="content">
            {view === "send" ? (
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Data point</th>
                                <th>Data</th>
                                <th>Coordinates</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sendDataRows.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder={"Deventer"}
                                            value={row.dataPoint}
                                            onChange={(e) => handleChange(index, "dataPoint", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder={"Dark soil"}
                                            value={row.data}
                                            onChange={(e) => handleChange(index, "data", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder={"40.7128° N, 74.0060° W"}
                                            value={row.coordinates}
                                            onChange={(e) => handleChange(index, "coordinates", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleAddRow()}>+</button>
                                        {sendDataRows.length > 1 && (
                                            <button onClick={() => handleRemoveRow(index)}>-</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="send-button-container">
                            <button className="send-button">Send</button>
                        </div>
                    </div>
            ) : (
                <div>
                <ul>
                            {retrieveDataRows.map((row, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleDataPointClick(row)}
                                >
                                    {row.dataPoint} {row.coordinates && `(${row.coordinates})`}
                                </li>
                            ))}
                        </ul>
                        {popup && (
                            <div className="popup">
                                <p>Data Point: {popup.dataPoint}</p>
                                <p>Data: {popup.data}</p>
                                <p>Coordinates: {popup.coordinates}</p>
                                <button onClick={closePopup}>Close</button>
                            </div>
                        )}
                        {popup && <div className="overlay" onClick={closePopup}></div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Menu;
