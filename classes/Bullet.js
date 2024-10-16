class Bullet {
    constructor(x, y) {
      this.width = 5;
      this.height = 15;
      this.x = x;
      this.y = y;
      this.speed = 7;
    }
  
    draw() {
      ctx.fillStyle = "#0ff";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  
    move() {
      this.y -= this.speed;
    }
}
export default Bullet;