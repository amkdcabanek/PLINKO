class Divider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rect = {
            x: x - width/2,
            y: y,
            width: width,
            height: height
        };
    }
    
    draw(ctx) {
        // Draw divider with gradient effect
        const darker = '#505050'; // (80, 80, 80)
        const lighter = '#969696'; // (150, 150, 150)
        
        ctx.fillStyle = lighter;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        ctx.strokeStyle = darker;
        ctx.strokeRect(this.rect.x + 2, this.rect.y, this.rect.width - 4, this.rect.height);
    }
}