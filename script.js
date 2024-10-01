// To store the daily water usage and date
let waterUsageHistory = [];

// Initialize total water used and eco points
let totalWaterUsed = 0;
let totalEcoPoints = 0; // New variable for total eco points

// Chart.js setup
const dailyUsageChartCtx = document.getElementById('dailyUsageChart').getContext('2d');
const weeklyUsageChartCtx = document.getElementById('weeklyUsageChart').getContext('2d');
const monthlyUsageChartCtx = document.getElementById('monthlyUsageChart').getContext('2d');

let dailyUsageChart;
let weeklyUsageChart;
let monthlyUsageChart;

// Event Listener for Daily Usage Button
document.getElementById('daily-usage-btn').addEventListener('click', function() {
    // Prompt user for daily water usage and date
    let dailyUsage = prompt("Enter today's water usage in liters:");
    let currentDate = prompt("Enter the current date (e.g., YYYY-MM-DD):");

    // Ensure input is a number and valid date
    if (!isNaN(dailyUsage) && dailyUsage > 0 && Date.parse(currentDate)) {
        // Store data in water usage history
        waterUsageHistory.push({ date: currentDate, usage: parseFloat(dailyUsage) });

        // Update total water used
        totalWaterUsed += parseFloat(dailyUsage);

        // Calculate points based on daily usage
        let pointsEarned = calculatePoints(dailyUsage);
        totalEcoPoints += pointsEarned; // Update total eco points

        // Update water used on the UI
        document.getElementById('water-used').innerText = `${totalWaterUsed.toFixed(2)} L`; // Display cumulative total

        // Update eco points on the UI
        document.getElementById('eco-points').innerText = `${totalEcoPoints}`; // Display cumulative eco points

        // Update the eco points share message dynamically
        updateEcoPointsShare(totalEcoPoints);

        // Update charts
        updateCharts();

        alert("Data recorded successfully for " + currentDate);
    } else {
        alert('Please enter valid water usage and date.');
    }
});

// Function to update the eco points share message in "Share Your Achievements!"
function updateEcoPointsShare(points) {
    const shareMessageElement = document.getElementById('eco-points-share');
    shareMessageElement.innerText = `You've earned ${points} Eco Points!`;
}

// Function to update charts
function updateCharts() {
    // Prepare data for daily chart
    const dates = waterUsageHistory.map(record => record.date);
    const usages = waterUsageHistory.map(record => record.usage);

    // Update Daily Usage Chart
    if (dailyUsageChart) {
        dailyUsageChart.data.labels = dates;
        dailyUsageChart.data.datasets[0].data = usages;
        dailyUsageChart.update();
    } else {
        dailyUsageChart = new Chart(dailyUsageChartCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Daily Water Usage (L)',
                    data: usages,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Update Weekly Usage Chart
    updateWeeklyChart();
    
    // Update Monthly Usage Chart
    updateMonthlyChart();
}

// Function to update Weekly Chart
function updateWeeklyChart() {
    const weeklyData = {};
    
    waterUsageHistory.forEach(record => {
        const weekStart = new Date(record.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Get start of the week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = 0;
        }
        weeklyData[weekKey] += record.usage;
    });

    const weeklyLabels = Object.keys(weeklyData);
    const weeklyUsages = Object.values(weeklyData);

    if (weeklyUsageChart) {
        weeklyUsageChart.data.labels = weeklyLabels;
        weeklyUsageChart.data.datasets[0].data = weeklyUsages;
        weeklyUsageChart.update();
    } else {
        weeklyUsageChart = new Chart(weeklyUsageChartCtx, {
            type: 'bar',
            data: {
                labels: weeklyLabels,
                datasets: [{
                    label: 'Weekly Water Usage (L)',
                    data: weeklyUsages,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Function to update Monthly Chart
function updateMonthlyChart() {
    const monthlyData = {};
    
    waterUsageHistory.forEach(record => {
        const monthKey = new Date(record.date).toISOString().slice(0, 7); // Format: YYYY-MM
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += record.usage;
    });

    const monthlyLabels = Object.keys(monthlyData);
    const monthlyUsages = Object.values(monthlyData);

    if (monthlyUsageChart) {
        monthlyUsageChart.data.labels = monthlyLabels;
        monthlyUsageChart.data.datasets[0].data = monthlyUsages;
        monthlyUsageChart.update();
    } else {
        monthlyUsageChart = new Chart(monthlyUsageChartCtx, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: 'Monthly Water Usage (L)',
                    data: monthlyUsages,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
// Function to share on Facebook
document.getElementById('share-facebook').addEventListener('click', function() {
    const ecoPoints = document.getElementById('eco-points').innerText;
    const url = encodeURIComponent(window.location.href); // Get the current page URL
    const message = `I've earned ${ecoPoints} Eco Points! Check out this app: ${url}`;
    
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(message)}`, '_blank');
});

// Function to share on Twitter
document.getElementById('share-twitter').addEventListener('click', function() {
    const ecoPoints = document.getElementById('eco-points').innerText;
    const url = encodeURIComponent(window.location.href);
    const message = `I've earned ${ecoPoints} Eco Points! Check out this app: ${url}`;
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${url}`, '_blank');
});

// Function to share on WhatsApp
document.getElementById('share-whatsapp').addEventListener('click', function() {
    const ecoPoints = document.getElementById('eco-points').innerText;
    const message = `I've earned ${ecoPoints} Eco Points! Check out this app: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
});


// Event Listener for Monthly Report Button
document.getElementById('monthly-report-btn').addEventListener('click', function() {
    // Calculate monthly usage by summing up the water usage history
    if (waterUsageHistory.length === 0) {
        alert("No data recorded yet.");
        return;
    }

    let totalUsage = waterUsageHistory.reduce((total, record) => total + record.usage, 0);
    let averageUsage = (totalUsage / waterUsageHistory.length).toFixed(2);

    // Show the monthly report
    alert("Total Water Usage for the Month: " + totalUsage + " L\nAverage Daily Usage: " + averageUsage + " L");
});

// Event Listener for View History Button
document.getElementById('view-history-btn').addEventListener('click', function() {
    if (waterUsageHistory.length === 0) {
        alert("No data recorded yet.");
        return;
    }

    let historyText = waterUsageHistory.map(record => `Date: ${record.date}, Usage: ${record.usage} L`).join('\n');
    alert("Water Usage History:\n" + historyText);
});

// Calculate eco points based on water usage
function calculatePoints(usage) {
    let points;
    if (usage <= 50) {
        points = 300;
    } else if (usage <= 100) {
        points = 200;
    } else if (usage <= 150) {
        points = 100;
    } else {
        points = 50;
    }
    return points;
}

// Initialize empty charts on load
initializeEmptyCharts();

// Function to initialize empty charts
function initializeEmptyCharts() {
    dailyUsageChart = new Chart(dailyUsageChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Water Usage (L)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    weeklyUsageChart = new Chart(weeklyUsageChartCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Weekly Water Usage (L)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    monthlyUsageChart = new Chart(monthlyUsageChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Monthly Water Usage (L)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to initialize FAQ section
function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            if (answer.style.display === "none" || answer.style.display === "") {
                answer.style.display = "block"; // Show answer
            } else {
                answer.style.display = "none"; // Hide answer
            }
        });
    });
}

// Call the initFAQ function when the document is ready
document.addEventListener('DOMContentLoaded', initFAQ);
