
const BASE_URL = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('details-content');
    const selectedId = localStorage.getItem("selectedDeviceId");

    if (!selectedId) return;

    try {
        let device;
        // Llamada a ela API
        const response = await fetch(`${BASE_URL}/devices/${selectedId}`);
        device = await response.json();

        if (device) {
            renderDetail(device, container);
        }
    } catch (error) {
        container.innerHTML = "<h2>Error loading details</h2>";
    }
});

function renderDetail(device, container) {
    container.innerHTML = `
        <div class="device-card" style="max-width: 600px; margin: 0 auto;">
            <h1>${device.name}</h1>
            <p class="label"><b>Brand:</b> ${device.brand}</p>
            <p class="label"><b>Type:</b> ${device.type}</p>
            <p class="label"><b>Date:</b> ${device.purchaseDate}</p>
            <div class="badge ${device.reusable ? 'status-ok' : 'status-pending'}">
                ${device.reusable ? 'REUSABLE' : 'SINGLE USE'}
            </div>
        </div>
    `;
}