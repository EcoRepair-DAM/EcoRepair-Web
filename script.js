// URL de los archivos de prueba
const DEVICES_URL = "./devices.json";
const REPAIRS_URL = "./repairs.json";

// Al cargar la web
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar clicks en el menú
    document.getElementById('nav-devices').onclick = (e) => showView(e, 'devices');
    document.getElementById('nav-repairs').onclick = (e) => showView(e, 'repairs');

    // Cargar dispositivos por defecto
    loadData('devices');
});

function showView(event, view) {
    // Actualizar botones del menú
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Actualizar textos
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
    const grid = document.getElementById('main-grid');
    grid.innerHTML = "<p>Loading...</p>";

    try {
        const url = type === 'devices' ? DEVICES_URL : REPAIRS_URL;
        const response = await fetch(url);
        const data = await response.json();

        grid.innerHTML = ""; // Limpiar grid

        if (type === 'devices') {
            renderDevices(data, grid);
        } else {
            renderRepairs(data, grid);
        }
    } catch (error) {
        grid.innerHTML = "<p style='color:red'>Error loading data. Check if JSON files exist.</p>";
    }
}

function renderDevices(data, container) {
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'device-card';
        card.innerHTML = `
            <h3 class="device-name">${item.name}</h3>
            <span class="label"><b>Brand:</b> ${item.brand}</span>
            <span class="label"><b>Type:</b> ${item.type}</span>
            <span class="label"><b>Purchased:</b> ${item.purchaseDate}</span>
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
            <h3 style="font-size:1.1rem">${item.description}</h3>
            <p class="repair-cost">${item.cost.toFixed(2)} €</p>
            <span class="label"><b>Date:</b> ${item.repairDate}</span>
            <span class="label"><b>Device ID:</b> #${item.deviceId}</span>
            <div class="badge ${item.repair ? 'status-ok' : 'status-pending'}">
                ${item.repair ? '✓ FINISHED' : '⟳ IN PROGRESS'}
            </div>
        `;
        container.appendChild(card);
    });
}