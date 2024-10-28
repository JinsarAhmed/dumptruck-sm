// Simulation Data
let trucks = [];
let loadingQueue = [];
let weighingQueue = [];
let travelQueue = [];
let completedQueue = [];
let loadersBusy = {};
let scaleBusy = {};

// Function to create truck input fields in rows
function createTruckInputs() {
    const container = document.getElementById('truckConfig');
    const numTrucks = parseInt(document.getElementById('numTrucks').value) || 1;
    container.innerHTML = '';

    for (let i = 1; i <= numTrucks; i++) {
        container.innerHTML += `
            <div class="truck-config-row">
                <h4>Truck ${i}</h4>
                <label>Loading Time:</label>
                <input type="number" id="loadingTime${i}" value="${getRandomTime()}" />
                <label>Weighing Time:</label>
                <input type="number" id="weighingTime${i}" value="${getRandomTime()}" />
                <label>Travel Time:</label>
                <input type="number" id="travelTime${i}" value="${getRandomTime()}" />
            </div>
        `;
    }
}

// Random time generator
function getRandomTime() {
    return Math.floor(Math.random() * 10) + 5;
}

// Initialize Simulation
function initializeSimulation() {
    trucks = [];
    loadingQueue = [];
    weighingQueue = [];
    travelQueue = [];
    completedQueue = [];

    const numTrucks = parseInt(document.getElementById('numTrucks').value) || 1;
    const numLoaders = parseInt(document.getElementById('numLoaders').value) || 2;
    const numScales = parseInt(document.getElementById('numScales').value) || 1;

    // Initialize loaders and scales as free
    initializeLoaders(numLoaders);
    initializeScales(numScales);

    // Create trucks with input times
    for (let i = 1; i <= numTrucks; i++) {
        let truck = {
            id: i,
            loadingTime: parseInt(document.getElementById(`loadingTime${i}`).value) * 1000,
            weighingTime: parseInt(document.getElementById(`weighingTime${i}`).value) * 1000,
            travelTime: parseInt(document.getElementById(`travelTime${i}`).value) * 1000
        };
        trucks.push(truck);
    }

    loadingQueue = [...trucks];
    updateDisplay();
    startSimulation();
}

// Initialize loaders and scales
function initializeLoaders(numLoaders) {
    for (let i = 1; i <= numLoaders; i++) {
        loadersBusy[`loader${i}`] = false; // Set each loader as free
    }
}

function initializeScales(numScales) {
    for (let i = 1; i <= numScales; i++) {
        scaleBusy[`scale${i}`] = false; // Set each scale as free
    }
}

// Update Display
function updateDisplay() {
    updateQueueDisplay('loadingQueue', loadingQueue);
    updateQueueDisplay('weighingQueue', weighingQueue);
    updateQueueDisplay('travelQueue', travelQueue);
    updateQueueDisplay('completedQueue', completedQueue);
}

// Start Simulation
function startSimulation() {
    processTrucks();
}

// Main Simulation Logic
function processTrucks() {
    const loaders = document.querySelectorAll('.loader');
    Object.keys(loadersBusy).forEach(loaderId => {
        if (!loadersBusy[loaderId] && loadingQueue.length > 0) {
            loadTruck(loaderId, loadingQueue.shift());
        }
    });

    Object.keys(scaleBusy).forEach(scaleId => {
        if (!scaleBusy[scaleId] && weighingQueue.length > 0) {
            weighTruck(scaleId, weighingQueue.shift());
        }
    });

    setTimeout(() => processTrucks(), 1000);
}

// Load Truck
function loadTruck(loaderId, truck) {
    loadersBusy[loaderId] = true;
    document.getElementById(loaderId).classList.add('busy'); // Set loader to busy
    document.getElementById(loaderId).innerHTML = truck.id;

    setTimeout(() => {
        document.getElementById(loaderId).classList.remove('busy'); // Free the loader
        loadersBusy[loaderId] = false;
        weighingQueue.push(truck);
        updateDisplay();
    }, truck.loadingTime);
}

// Weigh Truck
function weighTruck(scaleId, truck) {
    scaleBusy[scaleId] = true;
    document.getElementById(scaleId).classList.add('busy'); // Set scale to busy
    document.getElementById(scaleId).innerHTML = truck.id;

    setTimeout(() => {
        document.getElementById(scaleId).classList.remove('busy'); // Free the scale
        scaleBusy[scaleId] = false;
        travelQueue.push(truck);
        updateDisplay();
        travelTruck(truck);
    }, truck.weighingTime);
}

// Travel Truck
function travelTruck(truck) {
    travelQueue.push(truck);
    updateDisplay();

    setTimeout(() => {
        travelQueue = travelQueue.filter(t => t.id !== truck.id); // Remove from travel
        completedQueue.push(truck);
        updateDisplay();
    }, truck.travelTime);
}

// Update Queue Display
function updateQueueDisplay(queueId, queue) {
    const queueDiv = document.getElementById(queueId);
    queueDiv.innerHTML = '';
    queue.forEach(truck => {
        const truckDiv = document.createElement('div');
        truckDiv.className = 'truck';
        truckDiv.innerText = truck.id;
        queueDiv.appendChild(truckDiv);
    });
}
