// Import necessary React hooks and styles
import React, {useContext, useState} from 'react';
import './App.css';

// Import UI components
import Header from './ui/header.js';
import Menu from "./ui/menu.js";
import ArcgisMap from "./map/arcgis-map";
import Modal from './ui/Modal.js';

// Define the main App component
function App() {
    // State to manage the visibility of the modal
    const [showModal, setShowModal] = useState(false);

    // shared token state of Header & Menu, lifted here.
    const [token, setToken] = useState('');

    // List of licenses with titles and URLs
    const licenses = [
        { title: 'CC BY 4.0 - IMBOR', URL: 'https://creativecommons.org/licenses/by/4.0/deed.nl' },
        { title: 'CC0 / CC Zero - GWSW', URL: 'https://creativecommons.org/share-your-work/cclicenses/' },
        { title: 'Algemene leveringsvoorwaarden van het Kadaster', URL: 'https://www.kadaster.nl/about-us/general-terms-of-delivery' },
        { title: 'CC BY 4.0 - PDOK', URL: 'https://www.pdok.nl/copyright' },
        { title: 'CC BY 4.0 - Klimaateffectatlas', URL: 'https://creativecommons.org/licenses/by/4.0/' },
        { title: 'Broloket Privacy Statement', URL: 'https://www.broloket.nl/privacy-statement' },
        { title: 'Esri Data Attributions and Terms of Use', URL: 'https://www.esri.com/en-us/legal/terms/data-attributions' },
        { title: 'Tygron End User Terms', URL: 'https://www.tygron.com/eindgebruikersvoorwaarden/' },
        { title: 'NLOG Disclaimer', URL: 'https://www.nlog.nl/disclaimer' },
        { title: 'Open Data - Rijkswaterstaat', URL: 'https://www.rijkswaterstaat.nl/zakelijk/open-data' },
        { title: 'AGPL v.3', URL: 'https://www.gnu.org/licenses/agpl-3.0.nl.html' },
        { title: 'IBM SPSS Terms and Conditions', URL: 'https://intranet.secure.griffith.edu.au/computing/software/terms-and-conditions/spss_t-and-c' },
        { title: 'CC BY-SA 3.0 DEED - QGIS', URL: 'https://creativecommons.org/licenses/by-sa/3.0/' },
        { title: 'OpenAI Terms of Use', URL: 'https://openai.com/policies/terms-of-use' },
        { title: 'Microsoft Terms of Use', URL: 'https://www.microsoft.com/en-us/legal/terms-of-use' },
        { title: 'Open-data - Rijksoverheid', URL: 'https://www.rijksoverheid.nl/opendata' },
        { title: 'Altum AI General Terms', URL: 'https://altum.ai/wp-content/uploads/Algemene-voorwaarden-Altum-AI.pdf' },
        { title: 'ODIN Open Data Watch', URL: 'https://odin.opendatawatch.com/' },
        { title: 'AERIUS Copyright', URL: 'https://www.aeriusproducten.nl/copyright' },
        { title: 'VEO Bomb Map Usage', URL: 'https://www.explosievenopsporing.nl/site/media/upload/files/29162_9veo-sec-13282-d-regeling-deelname-veo-bommenkaart-voor-niet-leden-d-v2-def_pdf_20201224104320.pdf' },
        { title: 'Provincie Overijssel Geo Viewer', URL: 'https://geo.overijssel.nl/viewer/app/master/v1' }
    ];

    // Function to toggle the modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Function to update token
    const updateToken = (newToken) => {
        setToken(newToken);
    };

    // Render the main structure of the app
    return (
        <div>
            {/* Header component with a toggle modal function */}
            <Header toggleModal={toggleModal} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '2px solid #000',
                marginBottom: '1rem'
            }} token={token} updateToken={updateToken}/>

            {/* Main content section with a map and a menu */}
            <main style={{ display: 'flex', flexDirection: 'row', margin: '50px' }}>
                <div style={{
                    flex: '2',
                    marginRight: '1rem'
                }}>
                    {/* ArcGIS Map component with styles */}
                    <ArcgisMap style={{
                        width: '100%',
                        height: '400px', // Adjust height as needed
                        objectFit: 'cover'
                    }} />
                </div>

                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Menu component */}
                    <Menu />
                </div>
            </main>

            {/* Modal component for displaying licenses */}
            <Modal show={showModal} onClose={toggleModal}>
                <div className="license-container" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <h1>Licenses</h1>
                    <ul className="license-list">
                        {licenses.map((license, index) => (
                            <li key={index} className="license-item">
                                <a href={license.URL} target="_blank" rel="noopener noreferrer">
                                    {license.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div> token={token} updateToken={updateToken}
            </Modal>
        </div>
    );
}

export default App;
