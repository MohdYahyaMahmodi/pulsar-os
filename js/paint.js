// Paint functionality
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const colorPickertwo = document.getElementById('color-picker-paint');
const brushSize = document.getElementById('brush-size');
const brushSizeLabel = document.getElementById('brush-size-label');
const eraserBtn = document.getElementById('eraser-btn');
const clearBtn = document.getElementById('clear-btn');

let isDrawing = false;
let isErasing = false;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#FFFFFF' : colorPickertwo.value;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

colorPickertwo.addEventListener('change', () => {
    isErasing = false;
    eraserBtn.classList.remove('bg-blue-500');
    eraserBtn.classList.add('bg-gray-600');
});

brushSize.addEventListener('input', () => {
    brushSizeLabel.textContent = `${brushSize.value}px`;
});

eraserBtn.addEventListener('click', () => {
    isErasing = !isErasing;
    if (isErasing) {
        eraserBtn.classList.remove('bg-gray-600');
        eraserBtn.classList.add('bg-blue-500');
    } else {
        eraserBtn.classList.remove('bg-blue-500');
        eraserBtn.classList.add('bg-gray-600');
    }
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Initialize paint
document.getElementById('paint-icon').addEventListener('click', () => {
    toggleWindow('paint-window');
    setTimeout(() => {
        resizeCanvas();
    }, 0);
});

// Resize canvas when window is resized
const paintWindow = document.getElementById('paint-window');
const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
});
resizeObserver.observe(paintWindow);
