export async function loadTemplates() {
    const builderContainer = document.getElementById('builder-container');
    const topbarContainer = document.getElementById('topbar-container');

    if (builderContainer) {
        const response = await fetch('/templates/builder.html');
        builderContainer.innerHTML = await response.text();
    }

    if (topbarContainer) {
        const response = await fetch('/templates/topbar.html');
        topbarContainer.innerHTML = await response.text();
    }
}
