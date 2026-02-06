// Asegúrate de que los nombres de los archivos coincidan exactamente (mayúsculas/minúsculas)
const DEVICES_URL = "devices.json"; 
const REPAIRS_URL = "repairs.json";

let rawData = []; 
let currentViewType = 'devices';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing buttons...");

    const btnDevices = document.getElementById('nav-devices');
    const btnRepairs = document.getElementById('nav-repairs');

    if (btnDevices && btnRepairs) {
        btnDevices.onclick = (e) => {
            console.log("Devices clicked");
            showView(e, 'devices');
        };
        btnRepairs.onclick = (e) => {
            console.log("Repairs clicked");
            showView(e, 'repairs');
        };
    } else {
        console.error("Navigation buttons NOT found in DOM. Check your IDs in index.html");
    }

    // Filtros
    document.getElementById('search-input').oninput = () => draw();
    document.getElementById('property-filter').onchange = () => draw();
    document.getElementById('sort-select').onchange = () => draw();

    loadData('devices');
});

function showView(event, view) {
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const title = document.getElementById('view-title');
    const desc = document.getElementById('view-desc');

    if (view === 'devices') {
        title.innerText = "Devices Inventory";
        desc.innerText = "Managing hardware components and stock";
        loadData('devices');
    } else {
        title.innerText = "Technical Repairs";
        desc.innerText = "Tracking costs and repair statuses";
        loadData('repairs');
    }
}

async function loadData(type) {
    currentViewType = type;
    const grid = document.getElementById('main-grid');
    grid.innerHTML = "<p>Loading data...</p>";

    const url = type === 'devices' ? DEVICES_URL : REPAIRS_URL;
    console.log(`Fetching from: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        rawData = await response.json();
        console.log("Data loaded successfully:", rawData);

        draw(); 
    } catch (error) {
        console.error("Fetch error:", error);
        grid.innerHTML = `<p style='color:red'>Error: ${error.message}. <br> Make sure you are using a Local Server (Live Server).</p>`;
    }
}

function draw() {
    const grid = document.getElementById('main-grid');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const propFilter = document.getElementById('property-filter').value;
    const sortOrder = document.getElementById('sort-select').value;

    let filtered = rawData.filter(item => {
        const name = (item.name || item.description || "").toLowerCase();
        const matchesText = name.includes(searchTerm);
        
        const itemProp = String(item.reusable !== undefined ? item.reusable : item.repair);
        const matchesProp = propFilter === "all" || itemProp === propFilter;
        
        return matchesText && matchesProp;
    });

    filtered.sort((a, b) => {
        const valA = (a.name || a.description || "").toLowerCase();
        const valB = (b.name || b.description || "").toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    grid.innerHTML = "";
    if (currentViewType === 'devices') {
        renderDevices(filtered, grid);
    } else {
        renderRepairs(filtered, grid);
    }
}

function renderDevices(data, container) {
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'device-card';
        card.innerHTML = `
            <h3 class="device-name">${item.name || 'N/A'}</h3>
            <span class="label"><b>Brand:</b> ${item.brand || 'N/A'}</span>
            <span class="label"><b>Type:</b> ${item.type || 'N/A'}</span>
            <span class="label"><b>Purchased:</b> ${item.purchaseDate || 'N/A'}</span>
            <div class="badge ${item.reusable ? 'status-ok' : 'status-pending'}">
                ${item.reusable ? 'REUSABLE' : 'SINGLE USE'}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderRepairs(data, container) {
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'repair-card';
        card.innerHTML = `
            <h3 style="font-size:1.1rem">${item.description || 'No description'}</h3>
            <p class="repair-cost">${(item.cost || 0).toFixed(2)} €</p>
            <span class="label"><b>Date:</b> ${item.repairDate || 'N/A'}</span>
            <span class="label"><b>Device ID:</b> #${item.deviceId || 'N/A'}</span>
            <div class="badge ${item.repair ? 'status-ok' : 'status-pending'}">
                ${item.repair ? '✓ FINISHED' : '⟳ IN PROGRESS'}
            </div>
        `;
        container.appendChild(card);
    });
}