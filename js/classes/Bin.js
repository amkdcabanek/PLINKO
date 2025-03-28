class Bin {
    constructor(x, width, score) {
        this.x = x;
        this.width = width;
        this.scoreValue = score;
        this.count = 0;
        this.flash = 0;
        this.lastScore = 0;
    }

    incrementScore() {
        this.count += 1;
        this.flash = 1.0;
        this.lastScore = this.scoreValue;
        return this.scoreValue;
    }

    draw(ctx, height) {
        // Calculate color based on score value and flash
        const baseColor = '#509AFF'; // LIGHT_BLUE
        let color;
        
        if (this.flash > 0) {
            // Blend with bright color for flash effect
            const flashColor = '#00FFFF'; // CYAN
            const r = Math.floor(parseInt(baseColor.substr(1, 2), 16) * (1 - this.flash) + parseInt(flashColor.substr(1, 2), 16) * this.flash);
            const g = Math.floor(parseInt(baseColor.substr(3, 2), 16) * (1 - this.flash) + parseInt(flashColor.substr(3, 2), 16) * this.flash);
            const b = Math.floor(parseInt(baseColor.substr(5, 2), 16) * (1 - this.flash) + parseInt(flashColor.substr(5, 2), 16) * this.flash);
            color = `rgb(${r}, ${g}, ${b})`;
            this.flash -= 0.05;
        } else {
            color = baseColor;
        }
            
        // Draw bin with 3D effect
        ctx.fillStyle = color;
        ctx.fillRect(this.x, height - 50, this.width, 50);
        ctx.strokeStyle = '#3264C8'; // (50, 100, 200)
        ctx.strokeRect(this.x, height - 50, this.width, 50);
        
        // Draw score
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFFFFF'; // WHITE
        
        // Add shadow effect
        const shadowOffset = 1;
        ctx.fillStyle = '#1E1E1E'; // shadow_color
        ctx.fillText(this.scoreValue.toString(), this.x + this.width/2 - ctx.measureText(this.scoreValue.toString()).width/2 + shadowOffset, height - 30 + shadowOffset);
        ctx.fillText(`x${this.count}`, this.x + this.width/2 - ctx.measureText(`x${this.count}`).width/2 + shadowOffset, height - 10 + shadowOffset);
        
        ctx.fillStyle = '#FFFFFF'; // WHITE
        ctx.fillText(this.scoreValue.toString(), this.x + this.width/2 - ctx.measureText(this.scoreValue.toString()).width/2, height - 30);
        ctx.fillText(`x${this.count}`, this.x + this.width/2 - ctx.measureText(`x${this.count}`).width/2, height - 10);
    }
}