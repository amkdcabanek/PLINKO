// This file contains utility functions for the Plinko game.

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function detectCollision(circle, rect) {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) return false;
    if (distY > (rect.height / 2 + circle.radius)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}