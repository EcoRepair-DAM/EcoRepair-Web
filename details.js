document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('details-content');
    const selectedId = localStorage.getItem("selectedDeviceId");

    if (!selectedId) {
        container.innerHTML = "<h2>No device selected</h2>";
        return;
    }

    try {
        const response = await fetch("devices.json");
        const devices = await response.json();
        const device = devices.find(d => d.id == selectedId);

        if (device) {
            container.innerHTML = `
                <div class="device-card" style="max-width: 600px; margin: 0 auto;">
                    <h1 class="device-name">${device.name}</h1>
                    <p class="label"><b>Brand:</b> ${device.brand}</p>
                    <p class="label"><b>Type:</b> ${device.type}</p>
                    <p class="label"><b>Date:</b> ${device.purchaseDate}</p>
                    <p class="label"><b>ID:</b> #${device.id}</p>
                    <div class="badge ${device.reusable ? 'status-ok' : 'status-pending'}">
                        ${device.reusable ? 'REUSABLE' : 'SINGLE USE'}
                    </div>
                </div>
            `;
        }
    } catch (e) {
        container.innerHTML = "Error loading details.";
    }
});