// Get the canvas element and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Function to draw nested circles
function drawNestedCircles(numCircles, radius, colors) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < numCircles; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (i + 1), 0, 2 * Math.PI);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.closePath();
    }
}

// Example usage
const numCircles = 5;
const radius = 20;
const colors = ['#FF5733', '#FFBD33', '#33FF57', '#336BFF', '#8A33FF'];

drawNestedCircles(numCircles, radius, colors);



/******************************************** */

// Get the circle container
const circleContainer = document.getElementById('circleContainer');

// Function to draw nested circles
function drawNestedCircles(numCircles, radius, colors) {
    const centerX = circleContainer.clientWidth / 2;
    const centerY = circleContainer.clientHeight / 2;
    
    for (let i = 0; i < numCircles; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.width = `${2 * radius * (i + 1)}px`;
        circle.style.height = `${2 * radius * (i + 1)}px`;
        circle.style.left = `${centerX - radius * (i + 1)}px`;
        circle.style.top = `${centerY - radius * (i + 1)}px`;
        circle.style.backgroundColor = colors[i % colors.length];
        circleContainer.appendChild(circle);
    }
}

// Example usage
const numCircles = 5;
const radius = 20;
const colors = ['#FF5733', '#FFBD33', '#33FF57', '#336BFF', '#8A33FF'];

drawNestedCircles(numCircles, radius, colors);


Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nested Circles</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .circle-container {
            position: relative;
            width: 400px;
            height: 400px;
            border: 2px solid #000;
        }
        .circle {
            position: absolute;
            border-radius: 50%;
            background-color: #FF5733; /* Default color */
        }
    </style>
</head>
<body>
    <div class="circle-container" id="circleContainer"></div>
    <script src="script.js"></script>
</body>
</html>