class Alien {
    constructor(x, y, type) {
      this.width = 40;
      this.height = 40;
      this.x = x;
      this.y = y;
      this.speed = 1 + level * 0.5;
      this.type = type; // Assign the type
      this.points = points; // Store points for this alien type
    }
  
    draw() {
      if (this.type === 'default') {
        ctx.fillStyle = "#32a852"; // Alien green color for the body
        ctx.beginPath();
        ctx.arc(
          this.x + this.width / 2, 
          this.y + this.height / 2, 
          this.width / 2, 
          0,
          Math.PI * 2 // Full circle
        );
        ctx.fill();
    
        // Eyes
        ctx.fillStyle = "#ffffff"; 
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
    
        // Pupils
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
        ctx.fill();
    
        // Antennae
        ctx.strokeStyle = "#ff00ff"; 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 3, this.y); 
        ctx.lineTo(this.x + this.width / 3, this.y - this.height / 4);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(this.x + (2 * this.width) / 3, this.y);
        ctx.lineTo(this.x + (2 * this.width) / 3, this.y - this.height / 4);
        ctx.stroke();
      } 
      else if (this.type === 'terrific') {
        // Terrific Alien appearance
        ctx.fillStyle = "#8b0000"; // Dark red body
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
  
        // Eyes (one misaligned pupil to look scary)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
  
        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
  
        // Pupils (misaligned one)
        ctx.fillStyle = "#000000";
        // Left pupil
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
        ctx.fill();
  
        // Right pupil (slightly offset)
        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3 + 5, this.y + this.height / 3 + 5, this.width / 12, 0, Math.PI * 2);
        ctx.fill();
  
        // Add horns
        ctx.strokeStyle = "#8b0000"; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 4, this.y); 
        ctx.lineTo(this.x + this.width / 5, this.y - this.height / 4); // Left horn
        ctx.stroke();
  
        ctx.beginPath();
        ctx.moveTo(this.x + (3 * this.width) / 4, this.y); 
        ctx.lineTo(this.x + (4 * this.width) / 5, this.y - this.height / 4); // Left horn
        ctx.stroke();
  
        // Add jagged teeth
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 4, this.y + (2 * this.height) / 3); // Left tooth
        ctx.lineTo(this.x + this.width / 2, this.y + (3 * this.height) / 4); // Middle tooth
        ctx.lineTo(this.x + (3 * this.width) / 4, this.y + (2 * this.height) / 3); // Right tooth
        ctx.closePath();
        ctx.fill();
  
        // Add scar (diagonal line across face)
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 4, this.y + this.height / 2);
        ctx.lineTo(this.x + (3 * this.width) / 4, this.y + this.height / 3);
        ctx.stroke();
      }
      else if (this.type === 'cute') {
        // Cute Alien appearance
        ctx.fillStyle = "#FF69B4"; 
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Big round eyes
        ctx.fillStyle = "#ffffff"; 
        ctx.beginPath();
        ctx.arc(this.x + this.width / 4, this.y + this.height / 2.5, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (3 * this.width) / 4, this.y + this.height / 2.5, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Big black pupils
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 4, this.y + this.height / 2.5, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (3 * this.width) / 4, this.y + this.height / 2.5, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Cute blushing cheeks (small pink circles)
        ctx.fillStyle = "#FFC0CB";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 4, this.y + (2 * this.height) / 3, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (3 * this.width) / 4, this.y + (2 * this.height) / 3, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
  
        ctx.fillStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";
        // Horns
        ctx.strokeStyle = "#FF69B4";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 4, this.y);
        ctx.lineTo(this.x + this.width / 5, this.y - this.height / 4); // Left horn
        ctx.stroke();
  
        ctx.beginPath();
        ctx.moveTo(this.x + (3 * this.width) / 4, this.y);
        ctx.lineTo(this.x + (4 * this.width) / 5, this.y - this.height / 4); // Right horn
        ctx.stroke();
        
      } 
      else if (this.type === 'robotic') {
        // Robotic Alien appearance
        ctx.fillStyle = "#808080"; // Gray for metal body
          ctx.beginPath();
          ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
          ctx.fill();
  
          // Eyes
          ctx.fillStyle = "#ff0000"; // Red robotic eyes
          ctx.beginPath();
          ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
          ctx.fill();
  
          ctx.beginPath();
          ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
          ctx.fill();
  
          // Pupils
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
          ctx.fill();
  
          ctx.beginPath();
          ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
          ctx.fill();
  
          // antennae with lights
          ctx.strokeStyle = "#ff0000"; 
          ctx.lineWidth = 3;
          // Left antenna
          ctx.beginPath();
          ctx.moveTo(this.x + this.width / 3, this.y);
          ctx.lineTo(this.x + this.width / 3, this.y - this.height / 4);
          ctx.stroke();
  
          // Red light on top
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(this.x + this.width / 3, this.y - this.height / 4 - 5, 5, 0, Math.PI * 2);
          ctx.fill();
  
          // Right antenna
          ctx.beginPath();
          ctx.moveTo(this.x + (2 * this.width) / 3, this.y);
          ctx.lineTo(this.x + (2 * this.width) / 3, this.y - this.height / 4);
          ctx.stroke();
  
          // Red light on top
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(this.x + (2 * this.width) / 3, this.y - this.height / 4 - 5, 5, 0, Math.PI * 2);
          ctx.fill();
  
          // mouth
          ctx.fillStyle = "#000000";
          ctx.fillRect(this.x + this.width / 3, this.y + (2 * this.height) / 3, this.width / 3, this.height / 6);
      } 
      else if (this.type === 'ghostly') {
        //body
          ctx.fillStyle = "#F8F8FF"; 
          ctx.beginPath();
          ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Eyes 
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.ellipse(this.x + this.width / 4, this.y + this.height / 3, this.width / 8, this.height / 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(this.x + (3 * this.width) / 4, this.y + this.height / 3, this.width / 8, this.height / 4, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Tail
          ctx.fillStyle = "#F8F8FF";
          ctx.beginPath();
          ctx.moveTo(this.x, this.y + this.height);
          ctx.quadraticCurveTo(this.x + this.width / 2, this.y + this.height + 10, this.x + this.width, this.y + this.height);
          ctx.fill();
      }
    }
  
    move() {
      this.y += this.speed;
    }
  }
  export default Alien;