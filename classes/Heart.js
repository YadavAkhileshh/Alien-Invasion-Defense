class Heart {
    constructor(x, y) {
      this.width = 30;
      this.height = 30;
      this.x = x;
      this.y = y;
      this.speed = 2; 
    }
  
    draw() {
      ctx.fillStyle = "#FF0000";
      
      // Heart shape using bezier curves
      ctx.beginPath();
      const topCurveHeight = this.height * 0.3;
      ctx.moveTo(this.x, this.y + topCurveHeight);
      
      // Top left curve
      ctx.bezierCurveTo(
        this.x, this.y, 
        this.x - this.width / 2, this.y, 
        this.x - this.width / 2, this.y + topCurveHeight
      );
      
      // Bottom left curve
      ctx.bezierCurveTo(
        this.x - this.width / 2, this.y + (this.height + topCurveHeight) / 2, 
        this.x, this.y + (this.height + topCurveHeight) / 2, 
        this.x, this.y + this.height
      );
      
      // Bottom right curve
      ctx.bezierCurveTo(
        this.x, this.y + (this.height + topCurveHeight) / 2, 
        this.x + this.width / 2, this.y + (this.height + topCurveHeight) / 2, 
        this.x + this.width / 2, this.y + topCurveHeight
      );
  
      // Top right curve
      ctx.bezierCurveTo(
        this.x + this.width / 2, this.y, 
        this.x, this.y, 
        this.x, this.y + topCurveHeight
      );
      
      ctx.closePath();
      ctx.fill();
    }
  
    move() {
      this.y += this.speed;
    }
  }

  export default Heart