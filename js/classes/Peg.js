class Peg {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 6; // PEG_RADIUS
        this.glow = 0;
        this.glowDirection = 0;
    }

    draw(ctx) {
        // Draw glow effect
        if (this.glow > 0) {
            for (let r = this.radius + 5; r > this.radius; r--) {
                const alpha = this.glow * (255 - r * 40) / 255;
                if (alpha > 0) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
                    ctx.stroke();
                }
            }
            this.glow -= 0.05;
        }

        // Draw peg with 3D effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#B4B4B4'; // LIGHT_GRAY
        ctx.fill();
        
        // Highlight effect
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, this.radius - 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF'; // WHITE
        ctx.fill();
    }

    activateGlow() {
        this.glow = 1.0;
    }
}