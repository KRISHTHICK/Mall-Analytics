const dummyData = {
    keyStats: {
        totalPeople: 1234,
        currentPeople: 456,
        avgDwellTime: 23, // in minutes
        hotZones: 3
    },
    products: [
        { id: 1, name: 'Smartphone', interactions: 120, category: 'Electronics', thumbnail: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Laptop', interactions: 98, category: 'Electronics', thumbnail: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Headphones', interactions: 76, category: 'Electronics', thumbnail: 'https://via.placeholder.com/40' },
        { id: 4, name: 'T-Shirt', interactions: 250, category: 'Apparel', thumbnail: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Jeans', interactions: 180, category: 'Apparel', thumbnail: 'https://via.placeholder.com/40' },
        { id: 6, name: 'Burger', interactions: 300, category: 'Food', thumbnail: 'https://via.placeholder.com/40' },
    ],
    zones: [
        { id: 1, name: 'Food Court', people: 150, dwellTime: 35 },
        { id: 2, name: 'Electronics Zone', people: 120, dwellTime: 25 },
        { id: 3, name: 'Apparel Section', people: 186, dwellTime: 45 },
    ],
    cameras: [
        { id: 1, name: 'CAM-01-FC', status: 'Active', zone: 'Food Court' },
        { id: 2, name: 'CAM-02-FC', status: 'Active', zone: 'Food Court' },
        { id: 3, name: 'CAM-01-EZ', status: 'Offline', zone: 'Electronics Zone' },
        { id: 4, name: 'CAM-02-EZ', status: 'Active', zone: 'Electronics Zone' },
        { id: 5, name: 'CAM-01-AS', status: 'Active', zone: 'Apparel Section' },
    ],
    entrances: [
        { id: 1, name: 'Main Entrance', count: 543 },
        { id: 2, name: 'Garage Entrance', count: 321 },
        { id: 3, name: 'Food Court Entrance', count: 123 }
    ],
    heatmap: Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))
};