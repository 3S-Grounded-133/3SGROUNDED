import React, { useState, useEffect } from "react";
import "./menu.css";

const Menu = () => {
    const [view, setView] = useState("send");
    const [sendDataRows, setSendDataRows] = useState([{ dataPoint: "", data: "", coordinates: "" }]);
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState("");
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableData, setTableData] = useState([]);
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const response = await fetch("https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log()
                setSchemas(data["schemas"]);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchSchemas();
    }, []);

    const handleSchemaChange = async (schema) => {
        setSelectedSchema(schema);
        setTables([]); // Reset tables when a new schema is selected
        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${schema}/tables`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data)
            setTables(data["tables"]);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleTableChange = async (table) => {
        setSelectedTable(table);
        setTableData([]); // Reset table data when a new table is selected
        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${selectedSchema}/tables/${table}/data?&limit=100`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data)
            setTableData(data["data"]);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

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
                            <button className="send-button" onClick={handleSend}>Send</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            <select value={selectedSchema} onChange={(e) => handleSchemaChange(e.target.value)}>
                                <option value="" disabled>Select Schema</option>
                                {schemas.map((schema) => (
                                    <option key={schema} value={schema}>{schema}</option>
                                ))}
                            </select>
                            {selectedSchema && tables.length > 0 && (
                                <select value={selectedTable} onChange={(e) => handleTableChange(e.target.value)}>
                                    <option value="" disabled>Select Table</option>
                                    {tables.map((table) => (
                                        <option key={table} value={table}>{table}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <ul>
                            {tableData.map((row, index) => (
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
