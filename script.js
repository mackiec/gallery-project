// Get all draggable images
const images = document.querySelectorAll('.draggable');

let activeElement = null;
let shiftX = 0;
let shiftY = 0;
let zIndex = 0; // Keep track of the highest z-index
let lastMousePosition = { x: 0, y: 0 };
let mouseVelocity = { x: 0, y: 0 };

function handleStart(e) {
    // Calculate the difference between the pointer's position and the image's position
    let clientX = e.clientX || e.touches[0].clientX;
    let clientY = e.clientY || e.touches[0].clientY;
    shiftX = clientX - this.getBoundingClientRect().left;
    shiftY = clientY - this.getBoundingClientRect().top;

    // Set the active element to this image
    activeElement = this;

    // Change the cursor to a grabbing hand
    this.style.cursor = 'grabbing';
    this.style.position = 'fixed';

    // Increase the z-index so this image appears above all others
    this.style.zIndex = ++zIndex;

    // Remove any existing transition
    this.style.transition = '';

    // Add the mousemove and mouseup event listeners
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    // Record the initial mouse position
    lastMousePosition = { x: clientX, y: clientY };
}

function handleMove(e) {
    if (activeElement) {
        // Adjust the position of the image based on the pointer's position and the calculated difference
        let clientX = e.clientX || e.touches[0].clientX;
        let clientY = e.clientY || e.touches[0].clientY;
        activeElement.style.left = (clientX - shiftX) + 'px';
        activeElement.style.top = (clientY - shiftY) + 'px';

        // Calculate the mouse velocity
        mouseVelocity.x = clientX - lastMousePosition.x;
        mouseVelocity.y = clientY - lastMousePosition.y;

        // Update the last mouse position
        lastMousePosition = { x: clientX, y: clientY };
    }
}

function handleEnd(e) {
    if (activeElement) {
        // Apply a slide effect based on the final mouse velocity
        activeElement.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
        activeElement.style.left = (activeElement.offsetLeft + mouseVelocity.x * 2) + 'px'; // Increase multiplier for more noticeable effect
        activeElement.style.top = (activeElement.offsetTop + mouseVelocity.y * 2) + 'px'; // Increase multiplier for more noticeable effect

        // Reset the cursor and the active element
        activeElement.style.cursor = 'grab';
        activeElement = null;

        // Remove the mousemove and mouseup event listeners
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    }
}

// Add event listeners
images.forEach(img => {
    img.addEventListener('mousedown', handleStart, false);
    img.addEventListener('touchstart', handleStart, false);
    img.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
});
