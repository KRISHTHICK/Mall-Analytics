
document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE --- //
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });

    // --- SIDEBAR --- //
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('sidebar-open');
    const closeSidebarBtn = document.getElementById('sidebar-close');
    openSidebarBtn.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

    // --- DATA RENDERING --- //
    function renderKeyStats() {
        const container = document.getElementById('key-stats-container');
        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg interactive-panel" data-modal-title="Total People Detected">
                <h3 class="text-lg font-semibold">Total People Detected</h3>
                <p class="text-4xl font-bold mt-2 animate-counter">${dummyData.keyStats.totalPeople}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg interactive-panel" data-modal-title="Current People in Mall">
                <h3 class="text-lg font-semibold">Current People in Mall</h3>
                <p class="text-4xl font-bold mt-2 animate-counter">${dummyData.keyStats.currentPeople}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg interactive-panel" data-modal-title="Average Dwell Time">
                <h3 class="text-lg font-semibold">Average Dwell Time</h3>
                <p class="text-4xl font-bold mt-2">${dummyData.keyStats.avgDwellTime}m</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg interactive-panel" data-modal-title="Hot Zones">
                <h3 class="text-lg font-semibold">Hot Zones</h3>
                <p class="text-4xl font-bold mt-2 animate-counter">${dummyData.keyStats.hotZones}</p>
            </div>
        `;
    }

    function renderTopProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        dummyData.products.slice(0, 3).forEach(p => {
            productList.innerHTML += `
                <li class="flex items-center justify-between">
                    <div class="flex items-center">
                        <img src="${p.thumbnail}" alt="${p.name}" class="w-10 h-10 rounded-md">
                        <div class="ml-4">
                            <p class="font-semibold">${p.name}</p>
                            <p class="text-sm text-gray-500">${p.interactions} interactions</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">${p.category}</span>
                </li>
            `;
        });
    }

    function renderZoneActivityChart() {
        const ctx = document.getElementById('zone-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dummyData.zones.map(z => z.name),
                datasets: [{
                    data: dummyData.zones.map(z => z.people),
                    backgroundColor: ['#4F46E5', '#FBBF24', '#10B981'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    }

    function renderCameraStatus() {
        const cameraList = document.getElementById('camera-list');
        cameraList.innerHTML = '';
        dummyData.cameras.slice(0, 3).forEach(c => {
            cameraList.innerHTML += `
                <li class="flex items-center justify-between">
                    <span>${c.name} (${c.zone})</span>
                    <span class="px-2 py-1 text-xs font-semibold text-${c.status === 'Active' ? 'green' : 'red'}-800 bg-${c.status === 'Active' ? 'green' : 'red'}-200 rounded-full">${c.status}</span>
                </li>
            `;
        });
    }
    
    function renderHeatmap() {
        const container = document.getElementById('heatmap-container');
        container.innerHTML = '';
        dummyData.heatmap.forEach(value => {
            let bgColor = 'bg-green-500';
            if (value > 75) bgColor = 'bg-red-500';
            else if (value > 50) bgColor = 'bg-yellow-500';
            else if (value > 25) bgColor = 'bg-blue-500';
            container.innerHTML += `<div class="${bgColor} opacity-${Math.floor(value / 25) * 25}" title="Value: ${value}"></div>`;
        });
    }

    function animateCounters() {
        document.querySelectorAll('.animate-counter').forEach(counter => {
            const target = +counter.innerText.replace(/,/g, '');
            counter.innerText = '0';
            const updateCounter = () => {
                const current = +counter.innerText.replace(/,/g, '');
                const increment = target / 200;
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment).toLocaleString();
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCounter();
        });
    }

    function initializeDashboard() {
        renderKeyStats();
        renderTopProducts();
        renderZoneActivityChart();
        renderCameraStatus();
        renderHeatmap();
        renderDwellTimeChart();
        renderEntranceUsageChart();
        animateCounters();
        setupEventListeners();
    }

    function renderDwellTimeChart() {
        const ctx = document.getElementById('dwell-time-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dummyData.zones.map(z => z.name),
                datasets: [{
                    label: 'Average Dwell Time (minutes)',
                    data: dummyData.zones.map(z => z.dwellTime),
                    backgroundColor: '#FBBF24',
                }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });
    }

    function renderEntranceUsageChart() {
        const ctx = document.getElementById('entrance-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dummyData.entrances.map(e => e.name),
                datasets: [{
                    label: 'People Count',
                    data: dummyData.entrances.map(e => e.count),
                    backgroundColor: '#10B981',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // --- MODALS & OVERLAYS --- //
    const overlayModal = document.getElementById('overlay-modal');
    const formModal = document.getElementById('form-modal');
    let overlayChart;

    function setupEventListeners() {
        document.getElementById('close-overlay').addEventListener('click', () => overlayModal.classList.add('hidden'));
        document.getElementById('close-form-modal').addEventListener('click', () => formModal.classList.add('hidden'));

        document.querySelectorAll('.interactive-panel').forEach(el => {
            el.addEventListener('click', () => {
                document.getElementById('overlay-title').innerText = el.dataset.modalTitle;
                openOverlay('doughnut');
            });
        });
        
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = e.target.dataset.type;
                let formHtml = '';
                if (type === 'product') {
                    formHtml = `
                        <form id="add-product-form">
                            <div class="mb-4">
                                <label for="product-name" class="block text-sm font-medium">Product Name</label>
                                <input type="text" id="product-name" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" required>
                            </div>
                            <div class="mb-4">
                                <label for="product-interactions" class="block text-sm font-medium">Interactions</label>
                                <input type="number" id="product-interactions" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" required>
                            </div>
                            <div class="mb-4">
                                <label for="product-category" class="block text-sm font-medium">Category</label>
                                <input type="text" id="product-category" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" required>
                            </div>
                            <div class="mb-4">
                                <label for="product-thumbnail" class="block text-sm font-medium">Thumbnail URL</label>
                                <input type="text" id="product-thumbnail" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                            <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Product</button>
                        </form>
                    `;
                } else if (type === 'camera') {
                    formHtml = `
                        <form id="add-camera-form">
                            <div class="mb-4">
                                <label for="camera-name" class="block text-sm font-medium">Camera Name</label>
                                <input type="text" id="camera-name" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" required>
                            </div>
                            <div class="mb-4">
                                <label for="camera-status" class="block text-sm font-medium">Status</label>
                                <select id="camera-status" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option>Active</option>
                                    <option>Offline</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="camera-zone" class="block text-sm font-medium">Zone</label>
                                <input type="text" id="camera-zone" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" required>
                            </div>
                            <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Camera</button>
                        </form>
                    `;
                }
                document.getElementById('form-modal-title').innerText = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                document.getElementById('form-modal-content').innerHTML = formHtml;
                formModal.classList.remove('hidden');
            });
        });

        document.getElementById('chart-type-selector').addEventListener('change', (e) => openOverlay(e.target.value));
        
        document.getElementById('floor-plan-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) console.log('Uploaded file:', file.name);
        });

        document.getElementById('download-report-btn').addEventListener('click', downloadReport);
    }

    function openOverlay(chartType) {
        overlayModal.classList.remove('hidden');
        const ctx = document.getElementById('overlay-chart').getContext('2d');
        if (overlayChart) overlayChart.destroy();
        overlayChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Interactions',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: '#4F46E5',
                    borderColor: '#4F46E5',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        const explanationDiv = document.getElementById('chart-explanation');
        const title = document.getElementById('overlay-title').innerText;
        explanationDiv.innerHTML = `This <strong>${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart</strong> for <strong>${title}</strong> shows the trend of interactions over the past six months. You can switch to other chart types using the dropdown above to visualize the data in different ways.`
    }

    // --- REPORTING --- //
    function downloadReport() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Mall Analytics Report\r\n";
        csvContent += "Key Stats\r\nCategory,Value\r\n";
        Object.entries(dummyData.keyStats).forEach(([key, value]) => csvContent += `${key},${value}\r\n`);
        
        csvContent += "\r\nProducts\r\nID,Name,Interactions,Category\r\n";
        dummyData.products.forEach(p => csvContent += `${p.id},${p.name},${p.interactions},${p.category}\r\n`);

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "mall_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    initializeDashboard();
});
