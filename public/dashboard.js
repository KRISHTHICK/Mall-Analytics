document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        themeToggleLightIcon.classList.toggle('hidden');
        themeToggleDarkIcon.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('color-theme', 'dark');
        } else {
            localStorage.setItem('color-theme', 'light');
        }
    });

    // Sidebar Toggle
    const sidebar = document.querySelector('aside');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    // --- DATA RENDERING ---
    function renderKeyStats() {
        document.getElementById('total-people').innerText = dummyData.keyStats.totalPeople.toLocaleString();
        document.getElementById('current-people').innerText = dummyData.keyStats.currentPeople.toLocaleString();
        document.getElementById('avg-dwell-time').innerText = `${dummyData.keyStats.avgDwellTime}m`;
        document.getElementById('hot-zones').innerText = dummyData.keyStats.hotZones;
    }

    function renderTopProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        dummyData.products.forEach(product => {
            const li = document.createElement('li');
            li.className = 'flex items-center';
            li.innerHTML = `
                <img src="${product.thumbnail}" alt="Product" class="w-10 h-10 rounded-md">
                <div class="ml-4">
                    <p class="font-semibold">${product.name}</p>
                    <p class="text-sm text-gray-500">Interactions: ${product.interactions}</p>
                </div>
            `;
            productList.appendChild(li);
        });
    }

    function renderZoneActivity() {
        const zoneCtx = document.getElementById('zone-chart').getContext('2d');
        new Chart(zoneCtx, {
            type: 'doughnut',
            data: {
                labels: dummyData.zones.map(z => z.name),
                datasets: [{
                    data: dummyData.zones.map(z => z.people),
                    backgroundColor: ['#4F46E5', '#FBBF24', '#10B981'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    function renderCameraStatus() {
        const cameraList = document.getElementById('camera-list');
        cameraList.innerHTML = '';
        dummyData.cameras.forEach(camera => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between';
            li.innerHTML = `
                <span>${camera.name}</span>
                <span class="px-2 py-1 text-xs font-semibold text-${camera.status === 'Active' ? 'green' : 'red'}-800 bg-${camera.status === 'Active' ? 'green' : 'red'}-200 rounded-full">${camera.status}</span>
            `;
            cameraList.appendChild(li);
        });
    }

    function renderEntranceData() {
        const entranceList = document.getElementById('entrance-list');
        entranceList.innerHTML = '';
        dummyData.entrances.forEach(entrance => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between';
            li.innerHTML = `
                <span>${entrance.name}</span>
                <span class="font-semibold">${entrance.count}</span>
            `;
            entranceList.appendChild(li);
        });
    }

    function renderAll() {
        renderKeyStats();
        renderTopProducts();
        renderZoneActivity();
        renderCameraStatus();
        renderEntranceData();
    }

    renderAll();

    // --- OVERLAY ---
    const overlay = document.getElementById('overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const chartTypeSelector = document.getElementById('chart-type-selector');
    const overlayChartCanvas = document.getElementById('overlay-chart').getContext('2d');
    let overlayChart;

    const chartableElements = document.querySelectorAll('.shadow-lg');

    chartableElements.forEach(el => {
        el.addEventListener('click', () => {
            const title = el.querySelector('h3').innerText;
            document.getElementById('overlay-title').innerText = title;
            openOverlay('doughnut');
        });
        el.addEventListener('mouseenter', () => {
            el.classList.add('shadow-2xl', 'transform', '-translate-y-1');
        });
        el.addEventListener('mouseleave', () => {
            el.classList.remove('shadow-2xl', 'transform', '-translate-y-1');
        });
    });

    closeOverlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
    });

    chartTypeSelector.addEventListener('change', (e) => {
        openOverlay(e.target.value);
    });

    function openOverlay(chartType) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        if (overlayChart) {
            overlayChart.destroy();
        }

        overlayChart = new Chart(overlayChartCanvas, {
            type: chartType,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Interactions',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: '#4F46E5',
                    borderColor: '#4F46E5',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

    // --- EDIT MODAL ---
    const editModal = document.getElementById('edit-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const editModalTitle = document.getElementById('edit-modal-title');
    const editModalContent = document.getElementById('edit-modal-content');

    function openEditModal(title, content) {
        editModalTitle.innerText = title;
        editModalContent.innerHTML = content;
        editModal.classList.remove('hidden');
        editModal.classList.add('flex');
    }

    closeEditModal.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    // --- EVENT LISTENERS FOR ADD/EDIT ---
    document.querySelector('#product-list').previousElementSibling.querySelector('.bg-blue-600').addEventListener('click', () => {
        openEditModal('Add Product', '<input type="text" placeholder="Product Name" class="w-full p-2 border rounded">');
    });

    document.querySelector('#camera-list').previousElementSibling.querySelector('.bg-blue-600').addEventListener('click', () => {
        openEditModal('Add Camera', '<input type="text" placeholder="Camera Name" class="w-full p-2 border rounded">');
    });

    document.querySelector('#entrance-list').previousElementSibling.querySelector('.bg-blue-600').addEventListener('click', () => {
        openEditModal('Add Entrance', '<input type="text" placeholder="Entrance Name" class="w-full p-2 border rounded">');
    });

    // --- DOWNLOAD REPORT ---
    document.getElementById('download-report').addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Category,Value\r\n";
        Object.keys(dummyData.keyStats).forEach(key => {
            csvContent += `${key},${dummyData.keyStats[key]}\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "mall_analytics_report.csv");
        document.body.appendChild(link); 
        link.click();
    });

    // --- UPLOAD ---
    const floorPlanUpload = document.getElementById('floor-plan-upload');
    floorPlanUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Uploaded file:', file.name);
            // Here you would typically handle the file upload, e.g., by sending it to a server.
        }
    });
});