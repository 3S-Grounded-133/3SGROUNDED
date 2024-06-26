// Import necessary React hooks and styles
import React, { useState, useEffect } from "react";
import "./menu.css";
import Modal from "./Modal";

// Define the Menu component
const Menu = ({token}) => {
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

    // form values to create/delete new table
    const [createTableName, setCreateTableName] = useState('');
    const [deleteTableName, setDeleteTableName] = useState('');

    // modal toggle values
    const [showCreateTableModal, setShowCreateTableModal] = useState(false);
    const [showDeleteTableModal, setShowDeleteTableModal] = useState(false);

    // Fetch schemas when the component mounts
    useEffect(() => {
        fetchPublicSchemas();
    }, []);

    // Fetch the own data schema when the user is logged in & remove the schema when the user is logged out
    useEffect(() => {
        if (token) {
            setSchemas(schemas => [...schemas, "Own data"]);
        } else {
            fetchPublicSchemas();
        }

        setView("retrieve");
    }, [token]);

    const fetchPublicSchemas = async () => {
        try {
            const response = await fetch("https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setSchemas(data["schemas"]);
            setTables([]);
            setTableData([]); // cleanup the old content

        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Fetch tables owned by the user
    const fetchOwnTables = async () => {
        setSchemas(["Own data"]);
        setSelectedSchema("Own data");
        setTables([]);
        setSelectedTable("");
        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTables(data["tables"]);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    const handleViewChange = async (view) => {
        // cleanup values on view change from a public view-only schema.
        setSchemas([]);
        setTables([]);
        setSelectedSchema("");
        setSelectedTable("");
        setTableData([]);

        setView(view);

        if (view === "send") {
            if (token) {
                await fetchOwnTables();
            }
        } else {
            await fetchPublicSchemas();
            if (token) {
            setSchemas(schemas => [...schemas, "Own data"]);
            }
        }
    }

    // Handle schema change and fetch tables for the selected schema
    const handleSchemaChange = async (schema) => {
        /* Pass on default value */
        if (!schema) {
            return;
        }

        setSelectedSchema(schema);
        setTables([]); // Reset tables when a new schema is selected
        try {
            let response;
            if (schema !== "Own data") {
                response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${schema}/tables`);
            } else {
                response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                });
            }

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTables(data["tables"]);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Handle table selection: fetch data for the selected table (only when in 'retrieve' view)
    const handleTableSelection = async (table) => {
        // Pass on default value
        if (!table) {
            return;
        }

        setSelectedTable(table);
        setTableData([]); // Reset table data when a new table is selected

        if (view === 'retrieve') {
            try {
                let response;
                if (selectedSchema !== "Own data") {
                    response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/schemas/${selectedSchema}/tables/${table}/data?&limit=100`);
                } else {
                    response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables/${table}?&limit=100`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                        },
                    });
                }
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

    const handleCreateTableChange = (e) => {
        setCreateTableName(e.target.value);
    }

    const handleDeleteTableChange = (e) => {
        setDeleteTableName(e.target.value);
    }

    // Handle sending (user-owned) data to the API
    const handleSend = async () => {
        // if destination table not selected, display error & return
        if (!selectedTable) {
            window.alert("Please select table to send data to!");
            return;
        }

        const payload = [];
        for (const row of sendDataRows) {
            payload.push({
                data_point: row.dataPoint,
                data: row.data,
                coordinates: row.coordinates
            });
        }

        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables/${selectedTable}/data`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,

                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                window.alert("Failed to send data. Data point names must be unique, please check again.");
                return;
            } else {
                window.alert("Successfully saved data to table.");
            }
        } catch (error) {
            console.error("Error sending data:", error, payload);
        }

        setSendDataRows([{ dataPoint: "", data: "", coordinates: "" }]);
    };

    async function handleCreateTable(e) {
        e.preventDefault();

        const body = {
            "table_name": createTableName,
            "columns": {"data_point": "String", "data": "String", "coordinates": "String"},
            "primary_key": "data_point",
        }

        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                window.alert("Failed to create new table. Please check the name and try again.");
            }

            // re-fetch the new table list
            await fetchOwnTables();
        } catch (error) {
            console.error("Fetch error:", error);
        }

        setShowCreateTableModal(false);
    }

    async function handleDeleteTable(e) {
        e.preventDefault();

        try {
            const response = await fetch(`https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/user-data/tables/${deleteTableName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!response.ok) {
                window.alert("Failed to delete table. Please try again.");
            }

            // re-fetch the new table list
            await fetchOwnTables();
        } catch (error) {
            console.error("Fetch error:", error);
        }

        setShowDeleteTableModal(false);
    }

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
                <button className={"header-button" + (view === "send" ? " focused-view" : "")}
                        onClick={() => handleViewChange("send")}>
                    Send
                </button>
                <button className={"header-button" + (view === "retrieve" ? " focused-view" : "")}
                        onClick={() => handleViewChange("retrieve")}>
                    Retrieve
                </button>
            </div>
            <div className="dropdown-container">
                <div className="dropdown-wrapper">
                    {/* Schema selection dropdown */}
                    {view === "retrieve" ? (
                        <select className="dropdown" value={selectedSchema}
                                onChange={(e) => handleSchemaChange(e.target.value)}>
                            <option value="" disabled>Select Schema...</option>
                            {schemas.map((schema) => (
                                <option key={schema} value={schema}>{schema}</option>
                            ))}
                        </select>
                    ) : (
                        <select className="dropdown" value={selectedSchema}
                                onChange={(e) => handleSchemaChange(e.target.value)}>
                            <option value="" disabled>Select Schema</option>
                            {token ? <option>Own data</option> : null}
                        </select>
                    )}
                    {/* Table selection dropdown */}
                    {selectedSchema && tables.length > 0 && (
                        <select className="dropdown" id="table-selection-dropdown" value={selectedTable}
                                onChange={(e) => handleTableSelection(e.target.value)}>
                            <option value="">Select Table...</option>
                            {tables.map((table) => (
                                <option key={table} value={table}>{table}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Buttons to create/delete (owned) table */}
                {view === "send" && selectedSchema === "Own data" &&
                    <div className={"send-button-container"}>
                        <button className="table-list-button" onClick={() => {setShowCreateTableModal(true)}}>New table...</button>
                        <button className="table-list-button" onClick={() => setShowDeleteTableModal(true)}>Delete table...</button>
                    </div>
                }
            </div>

            <div className="content">
                {view === "send" ? (
                    token === "" ? (
                        <h2>Please log in to store own data</h2>
                    ) : (
                        <div>
                            {/* Input fields for sending data */}
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
                                {selectedSchema === "Own data" && <button className="send-button" onClick={handleSend}>Send</button>}
                            </div>
                        </div>
                )) : (
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

            {/* Create/delete table prompt modals */}
            <Modal show={showCreateTableModal} onClose={() => setShowCreateTableModal(false)}>
                <form onSubmit={handleCreateTable}>
                    <label>
                        Name:
                        <input placeholder={"Table name..."} onChange={handleCreateTableChange} required type="text"/>
                    </label>
                    {createTableName && <button type="submit" value="Submit" className="send-button">Submit</button>}
                </form>
            </Modal>

            <Modal show={showDeleteTableModal} onClose={() => setShowDeleteTableModal(false)}>
                <form onSubmit={handleDeleteTable}>
                    <label>
                        Name:
                        <select className="dropdown" id="table-selection-dropdown" value={deleteTableName}
                                onChange={handleDeleteTableChange}>
                            <option value="">Select Table...</option>
                            {tables.map((table) => (
                                <option key={table} value={table}>{table}</option>
                            ))}
                        </select>
                    </label>
                    {deleteTableName && <button type="submit" value="Submit" className="send-button">Submit</button>}
                </form>
            </Modal>

        </div>
    );
}

export default Menu;
