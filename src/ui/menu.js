// Import necessary React hooks and styles
import React, { useState, useEffect } from "react";
import "./menu.css";

// Define the Menu component
const Menu = () => {
    // State variables for managing views, data, and selection
    const [view, setView] = useState("send");
    const [sendDataRows, setSendDataRows] = useState([{ dataPoint: "", data: "", coordinates: "" }]);
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState("");
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableData, setTableData] = useState([]);
    const [popup, setPopup] = useState(null);
    const [columns, setColumns] = useState([]);

    // Fetch schemas when the component mounts
    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const response = await fetch("https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setSchemas(data["schemas"]);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchSchemas();
    }, []);

    // Handle schema change and fetch tables for the selected schema
    const handleSchemaChange = async (schema) => {
        setSelectedSchema(schema);
        setTables([]); // Reset tables when a new schema is selected
        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${schema}/tables`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTables(data["tables"]);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Handle table change and fetch data for the selected table
    const handleTableChange = async (table) => {
        setSelectedTable(table);
        setTableData([]); // Reset table data when a new table is selected
        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${selectedSchema}/tables/${table}/data?&limit=100`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTableData(data["data"]);

            // Extract column names
            if (data["data"].length > 0) {
                setColumns(Object.keys(data["data"][0]));
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Handle adding a new row to the send data
    const handleAddRow = () => {
        setSendDataRows([...sendDataRows, { dataPoint: "", data: "", coordinates: "" }]);
    };

    // Handle removing a row from the send data
    const handleRemoveRow = (index) => {
        const rows = [...sendDataRows];
        rows.splice(index, 1);
        setSendDataRows(rows);
    };

    // Handle changes in the send data inputs
    const handleChange = (index, field, value) => {
        const rows = [...sendDataRows];
        rows[index][field] = value;
        setSendDataRows(rows);
    };

    // Handle sending data to the API
    const handleSend = async () => {
        for (const row of sendDataRows) {
            const payload = {};
            columns.forEach(column => {
                payload[column] = sendDataRows[0][column] || "";
            });
            console.log(payload);
            try {
                const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${selectedSchema}/tables/${selectedTable}/data`, {
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

    // Handle data point click event to show popup
    const handleDataPointClick = (row) => {
        console.log("Data point clicked:", row);
        setPopup(row);
    };

    // Close the popup
    const closePopup = () => {
        setPopup(null);
    };

    // Render the Menu component
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
            <div className="dropdown-container">
                <div className="dropdown-wrapper">
                    {/* Schema selection dropdown */}
                    <select className="dropdown" value={selectedSchema} onChange={(e) => handleSchemaChange(e.target.value)}>
                        <option value="" disabled>Select Schema</option>
                        {schemas.map((schema) => (
                            <option key={schema} value={schema}>{schema}</option>
                        ))}
                    </select>
                    {/* Table selection dropdown */}
                    {selectedSchema && tables.length > 0 && (
                        <select className="dropdown" value={selectedTable} onChange={(e) => handleTableChange(e.target.value)}>
                            <option value="" disabled>Select Table</option>
                            {tables.map((table) => (
                                <option key={table} value={table}>{table}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            <div className="content">
                {view === "send" ? (
                    <div>
                        {/* Input fields for sending data */}
                        {columns.map((column, index) => (
                            <div key={index} className="field-container">
                                <label>{column}</label>
                                <input
                                    type="text"
                                    placeholder={`Field ${index + 1}`}
                                    value={sendDataRows[0][column] || ""}
                                    onChange={(e) => handleChange(0, column, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="send-button-container">
                            <button className="send-button" onClick={handleSend}>Send</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* List of retrieved data */}
                        <ul>
                            {tableData.map((row, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleDataPointClick(row)}
                                >
                                    Field {index} {row.coordinates && `(${row.coordinates})`}
                                </li>
                            ))}
                        </ul>
                        {/* Popup for data point details */}
                        {popup && (
                            <div className="popup">
                                {Object.keys(popup).map((key) => (
                                    <p key={key}>{key}: {popup[key]}</p>
                                ))}
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
