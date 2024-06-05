import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './map/map.js';
import Header from './ui/header.js';
import MapContainer from "./map/mapcontainer";
import map from ".//images/img.png"
import Menu from "./ui/menu.js"
import ArcgisMap from "./map/arcgis-map";

function App() {
    const licenses = [
        { title: 'MIT License', URL: 'https://opensource.org/licenses/MIT' },
        { title: 'GPL License', URL: 'https://www.gnu.org/licenses/gpl-3.0.en.html' },
        { title: 'Apache License 2.0', URL: 'https://www.apache.org/licenses/LICENSE-2.0' }
    ];

    return (
        <div>
            <Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '2px solid #000',
                marginBottom: '1rem'
            }}></Header>

            <main style={{display: 'flex', flexDirection: 'row', margin: '50px'}}>
                <div style={{
                    flex: '2',
                    marginRight: '1rem'
                }}>
                    {/*<MapContainer src={map} alt={"Map"}/>*/}
                    <ArcgisMap style={{
                        width: '100%',
                        height: '400px', // Adjust height as needed
                        objectFit: 'cover'
                    }}/>
                </div>

                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Menu></Menu>
                </div>

            </main>

            <div style={{bottom: '10%', left: '10px', width: '200px'}}>
                <h1>Licenses</h1>
                <ul style={{ paddingBottom: '20px', borderRadius: '5px'}}>
                    {licenses.map((license, index) => (
                        <li key={index} style={{ listStyleType: 'none', padding: '5px 0' }}>
                            <a href={license.URL} target="_blank" rel="noopener noreferrer">
                                {license.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
