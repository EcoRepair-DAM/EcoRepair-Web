// CONFIGURACIÓN: true para Spring Boot, false para archivos JSON
const useAPI = false; 

const BASE_URL = "http://localhost:8080";
const LOCAL_DEVICES = "devices.json"; 
const LOCAL_REPAIRS = "repairs.json";

let rawData = []; 
let currentViewType = 'devices';

document.addEventListener('DOMContentLoaded', () => {
    
    const btnDevices = document.getElementById('nav-devices');
    const btnRepairs = document.getElementById('nav-repairs');

    if (btnDevices) {
        btnDevices.onclick = (e) => {
            setActiveLink(e);
            showView('devices');
        };
    }
    if (btnRepairs) {
        btnRepairs.onclick = (e) => {
            setActiveLink(e);
            showView('repairs');
        };
    }

    document.getElementById('search-input').oninput = () => draw();
    document.getElementById('property-filter').onchange = () => draw();
    document.getElementById('sort-select').onchange = () => draw();

    loadData('devices');
});

// Función para gestionar la clase CSS 'active' en el menú
function setActiveLink(event) {
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Cambia los textos de la cabecera y carga los datos
async function showView(view) {
    currentViewType = view;
    const title = document.getElementById('view-title');
    const desc = document.getElementById('view-desc');

    if (view === 'devices') {
        title.innerText = "Devices Inventory";
        desc.innerText = "Managing hardware components and stock";
    } else {
        title.innerText = "Technical Repairs";
        desc.innerText = "Tracking costs and repair statuses";
    }
    
    await loadData(view);
}

async function loadData(type) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = "<p>Loading data...</p>";

    let url;
    if (useAPI) {
        url = BASE_URL + (type === 'devices' ? "/devices" : "/repairs");
    } else {
        url = type === 'devices' ? LOCAL_DEVICES : LOCAL_REPAIRS;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        rawData = await response.json();
        draw(); 
    } catch (error) {
        grid.innerHTML = `<p style='color:red'>Error: No se pudo obtener datos de ${url}</p>`;
    }
}

// Dibujamos los items
function draw() {
    const grid = document.getElementById('main-grid');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const propFilter = document.getElementById('property-filter').value;
    const sortOrder = document.getElementById('sort-select').value;

    // Aplicamos Filtros (Búsqueda + Propiedad Reusable/Repair)
    let filtered = rawData.filter(item => {
        // Buscar por nombre (devices) o descripción (repairs)
        const name = (item.name || item.description || "").toLowerCase();
        const matchesText = name.includes(searchTerm);
        
        // Filtrar por propiedad, reusable en devices, repair en repairs
        const itemPropValue = item.reusable !== undefined ? item.reusable : item.repair;
        const matchesProp = propFilter === "all" || String(itemPropValue) === propFilter;
        
        return matchesText && matchesProp;
    });

    // Ordenamos items
    filtered.sort((a, b) => {
        const valA = (a.name || a.description || "").toLowerCase();
        const valB = (b.name || b.description || "").toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    // Pintamos según la vista actual
    grid.innerHTML = "";
    if (filtered.length === 0) {
        grid.innerHTML = "<p>No results found.</p>";
        return;
    }

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
        card.style.cursor = "pointer";
        card.innerHTML = `
            <h3 class="device-name">${item.name || 'N/A'}</h3>
            <span class="label"><b>Brand:</b> ${item.brand || 'N/A'}</span>
            <span class="label"><b>Type:</b> ${item.type || 'N/A'}</span>
            <div class="badge ${item.reusable ? 'status-ok' : 'status-pending'}">
                ${item.reusable ? 'REUSABLE' : 'SINGLE USE'}
            </div>
        `;
        // Guardamos ID y navegamos al detalle
        card.onclick = () => {
            localStorage.setItem("selectedDeviceId", item.id);
            window.location.href = "details.html";
        };
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
            <div class="badge ${item.repair ? 'status-ok' : 'status-pending'}">
                ${item.repair ? '✓ FINISHED' : '⟳ IN PROGRESS'}
            </div>
        `;
        container.appendChild(card);
    });
}