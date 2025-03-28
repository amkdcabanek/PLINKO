class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Default radius - will be set in the game loop
        this.radius = BALL_RADIUS * scale;
        this.vx = Math.random() * 0.6 - 0.3;
        this.vy = 0;
        this.active = true;
        this.trail = [];
        this.color = '#FFD700'; // GOLD
        this.scored = false; // Track if this ball has already scored
    }

    update(pegs, bins, balls, dividers) {
        if (!this.active || this.scored) {
            return 0;
        }

        // Save position for trail
        this.trail.push({x: Math.round(this.x), y: Math.round(this.y)});
        if (this.trail.length > 10) {
            this.trail.shift();
        }

        // Apply gravity - same for mobile and desktop
        this.vy += GRAVITY;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Check for collisions with pegs
        for (const peg of pegs) {
            const dx = this.x - peg.x;
            const dy = this.y - peg.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < this.radius + peg.radius) {
                // Activate peg glow
                peg.activateGlow();
                
                // Ball has collided with a peg
                // Calculate bounce direction
                const angle = Math.atan2(dy, dx);
                
                // Apply bounce
                this.vx = Math.cos(angle) * 2 + (Math.random() - 0.5);
                this.vy = Math.sin(angle) * 2;
                
                // Move ball outside of peg
                const overlap = this.radius + peg.radius - distance;
                this.x += Math.cos(angle) * overlap;
                this.y += Math.sin(angle) * overlap;
            }
        }

        // Check for collisions with dividers
        for (const divider of dividers) {
            // Create a rectangle for the ball
            const ballRect = {
                x: this.x - this.radius,
                y: this.y - this.radius,
                width: this.radius * 2,
                height: this.radius * 2
            };
            
            if (detectCollision({x: this.x, y: this.y, radius: this.radius}, divider.rect)) {
                // Determine which side of the divider the ball hit
                const dx1 = this.x - divider.rect.x;
                const dx2 = divider.rect.x + divider.rect.width - this.x;
                const dy1 = this.y - divider.rect.y;
                const dy2 = divider.rect.y + divider.rect.height - this.y;
                
                const minDist = Math.min(dx1, dx2, dy1, dy2);
                
                if (minDist === dx1) { // Left side
                    this.x = divider.rect.x - this.radius;
                    this.vx *= -0.8; // BOUNCE_FACTOR
                } else if (minDist === dx2) { // Right side
                    this.x = divider.rect.x + divider.rect.width + this.radius;
                    this.vx *= -0.8; // BOUNCE_FACTOR
                } else if (minDist === dy1) { // Top side
                    this.y = divider.rect.y - this.radius;
                    this.vy *= -0.8; // BOUNCE_FACTOR
                } else if (minDist === dy2) { // Bottom side
                    this.y = divider.rect.y + divider.rect.height + this.radius;
                    this.vy *= -0.8; // BOUNCE_FACTOR
                }
            }
        }

        // Check for collisions with other balls
        for (const otherBall of balls) {
            if (otherBall !== this && otherBall.active) {
                const dx = this.x - otherBall.x;
                const dy = this.y - otherBall.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < this.radius + otherBall.radius) {
                    // Balls have collided
                    // Calculate collision normal
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    // Calculate relative velocity
                    const dvx = this.vx - otherBall.vx;
                    const dvy = this.vy - otherBall.vy;
                    
                    // Calculate impulse
                    const impulse = 2 * (dvx * nx + dvy * ny) / 2;
                    
                    // Apply impulse
                    this.vx -= impulse * nx;
                    this.vy -= impulse * ny;
                    otherBall.vx += impulse * nx;
                    otherBall.vy += impulse * ny;
                    
                    // Move balls outside of each other
                    const overlap = (this.radius + otherBall.radius - distance) / 2;
                    this.x += nx * overlap;
                    this.y += ny * overlap;
                    otherBall.x -= nx * overlap;
                    otherBall.y -= ny * overlap;
                }
            }
        }

        // Check for collisions with walls
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -0.8; // BOUNCE_FACTOR
        } else if (this.x > WIDTH - this.radius) {
            this.x = WIDTH - this.radius;
            this.vx *= -0.8; // BOUNCE_FACTOR
        }

        // Check if ball reached the bottom
        if (this.y > HEIGHT - this.radius) {
            // Mark ball as scored to prevent multiple scoring
            this.scored = true;
            
            // Determine which bin the ball fell into
            const binWidth = WIDTH / BIN_COUNT;
            const binIndex = Math.floor(this.x / binWidth);
            
            // Set ball to inactive
            this.active = false;
            
            if (binIndex >= 0 && binIndex < BIN_COUNT) {
                return bins[binIndex].incrementScore();
            }
        }
        
        return 0;
    }

    draw(ctx) {
        if (!this.active) {
            return;
        }
            
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = 255 * i / this.trail.length * 0.5 / 255;
            const radius = Math.floor(this.radius * (0.5 + i / this.trail.length * 0.5));
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
            ctx.fill();
        }
        
        // Draw ball with 3D effect
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Highlight effect
        const highlightRadius = Math.max(2 * scale, this.radius - 2 * scale);
        ctx.beginPath();
        ctx.arc(Math.round(this.x - 1 * scale), Math.round(this.y - 1 * scale), highlightRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFF00'; // BRIGHT_YELLOW
        ctx.fill();
    }
}