const API_URL = "./devices.json"; 

document.addEventListener('DOMContentLoaded', fetchDevices);

async function fetchDevices() {
    const grid = document.getElementById('devices-grid');
    grid.innerHTML = "<p>Loading hardware components...</p>";

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        grid.innerHTML = ""; 

        data.forEach(device => {
            const card = document.createElement('div');
            card.className = 'device-card';

            // Name
            const name = document.createElement('h3');
            name.className = 'device-name';
            name.innerText = device.name;

            // Brand & Type Row
            const details = document.createElement('div');
            details.className = 'device-info';
            details.innerHTML = `<span><b>Brand:</b> ${device.brand}</span> <span><b>Type:</b> ${device.type}</span>`;

            // Purchase Date
            const date = document.createElement('p');
            date.className = 'date-badge';
            date.innerText = `Purchased: ${new Date(device.purchaseDate).toLocaleDateString()}`;

            // Reusable Status
            const status = document.createElement('span');
            status.className = `reusable-tag ${device.reusable ? 'is-reusable' : 'not-reusable'}`;
            status.innerText = device.reusable ? "REUSABLE COMPONENT" : "SINGLE USE ONLY";

            // Assembly
            card.appendChild(name);
            card.appendChild(details);
            card.appendChild(date);
            card.appendChild(status);
            
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = "<p style='color:red;'>Error loading device data.</p>";
    }
}