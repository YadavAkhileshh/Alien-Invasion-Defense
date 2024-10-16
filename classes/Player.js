class Player {
    constructor() {
      this.width = 60;
      this.height = 60;
      this.x = canvas.width / 2 - this.width / 2;
      this.y = canvas.height - this.height - 10;
      this.speed = 5;
    }
  
    draw() {
      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.closePath();
      ctx.fill();
  
      ctx.fillStyle = "#00ffff";
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 3,
        this.width / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();
  
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(this.x - 10, this.y + this.height - 20, 10, 20);
      ctx.fillRect(this.x + this.width, this.y + this.height - 20, 10, 20);
    }
  
    move() {
      if ((keys.ArrowLeft || keys["KeyA"]) && this.x > 0)
        this.x -= this.speed;
      if ((keys.ArrowRight || keys["KeyD"]) && this.x < canvas.width - this.width)
        this.x += this.speed;
    }
}
export default Player;