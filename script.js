const DEVICES_URL = "devices.json"; 
const REPAIRS_URL = "repairs.json";

let rawData = []; 
let currentViewType = 'devices';

document.addEventListener('DOMContentLoaded', () => {
    const btnDevices = document.getElementById('nav-devices');
    const btnRepairs = document.getElementById('nav-repairs');

    if (btnDevices) btnDevices.onclick = (e) => showView(e, 'devices');
    if (btnRepairs) btnRepairs.onclick = (e) => showView(e, 'repairs');

    document.getElementById('search-input').oninput = () => draw();
    document.getElementById('property-filter').onchange = () => draw();
    document.getElementById('sort-select').onchange = () => draw();

    loadData('devices');
});

function showView(event, view) {
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    const title = document.getElementById('view-title');
    if (view === 'devices') {
        title.innerText = "Devices Inventory";
        loadData('devices');
    } else {
        title.innerText = "Technical Repairs";
        loadData('repairs');
    }
}

async function loadData(type) {
    currentViewType = type;
    const grid = document.getElementById('main-grid');
    try {
        const url = type === 'devices' ? DEVICES_URL : REPAIRS_URL;
        const response = await fetch(url);
        rawData = await response.json();
        draw(); 
    } catch (error) {
        grid.innerHTML = "<p>Error loading data.</p>";
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
        const valA = (a.name || a.description).toLowerCase();
        const valB = (b.name || b.description).toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    grid.innerHTML = "";
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = currentViewType === 'devices' ? 'device-card' : 'repair-card';
        card.style.cursor = "pointer";
        
        if (currentViewType === 'devices') {
            card.innerHTML = `
                <h3 class="device-name">${item.name}</h3>
                <span class="label"><b>Brand:</b> ${item.brand}</span>
                <div class="badge ${item.reusable ? 'status-ok' : 'status-pending'}">
                    ${item.reusable ? 'REUSABLE' : 'SINGLE USE'}
                </div>
            `;
            card.onclick = () => {
                localStorage.setItem("selectedDeviceId", item.id);
                window.location.href = "details.html";
            };
        } else {
            card.innerHTML = `<h3>${item.description}</h3><p class="repair-cost">${item.cost}€</p>`;
        }
        grid.appendChild(card);
    });
}