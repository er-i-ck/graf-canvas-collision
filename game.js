const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
    this.originalColor = color; // Color original
    this.isFlashing = false; // Indica si está en estado de "flasheo"
    this.flashTimeout = null;
  }

  // Dibuja el círculo en el canvas
  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  // Actualiza la posición del círculo y verifica colisiones
  update(context, circles) {
    this.draw(context);
    this.posX += this.dx;
    this.posY += this.dy;

    // Verificar colisión con los bordes del canvas
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
      this.flash(); // "Flashear" el círculo
    }

    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
      this.flash(); // "Flashear" el círculo
    }

    // Verificar colisión con otros círculos
    circles.forEach(otherCircle => {
      if (this !== otherCircle) {
        this.checkCollision(otherCircle);
      }
    });
  }

  // Método para verificar la colisión con otro círculo y calcular la colisión elástica
  checkCollision(otherCircle) {
    // Distancia entre los dos círculos
    const dx = this.posX - otherCircle.posX;
    const dy = this.posY - otherCircle.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Verificar si hay colisión
    if (distance < this.radius + otherCircle.radius) {
      // Colisión elástica
      const angle = Math.atan2(dy, dx);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // Rota las velocidades de los círculos para simplificar los cálculos
      const v1 = { x: this.dx * cos + this.dy * sin, y: this.dy * cos - this.dx * sin };
      const v2 = { x: otherCircle.dx * cos + otherCircle.dy * sin, y: otherCircle.dy * cos - otherCircle.dx * sin };

      // Conservación de la cantidad de movimiento para las velocidades después de la colisión
      const m1 = this.radius;
      const m2 = otherCircle.radius;
      const v1FinalX = ((m1 - m2) * v1.x + 2 * m2 * v2.x) / (m1 + m2);
      const v2FinalX = ((m2 - m1) * v2.x + 2 * m1 * v1.x) / (m1 + m2);

      // Asignar las nuevas velocidades después de la colisión
      this.dx = v1FinalX * cos - v1.y * sin;
      this.dy = v1FinalX * sin + v1.y * cos;
      otherCircle.dx = v2FinalX * cos - v2.y * sin;
      otherCircle.dy = v2FinalX * sin + v2.y * cos;

      // "Flashear" los dos círculos
      this.flash();
      otherCircle.flash();
    }
  }

  // Método para hacer que el círculo "flashee" en azul
  flash() {
    if (this.isFlashing) return; // Evitar que flashee varias veces al mismo tiempo
    this.isFlashing = true;
    const originalColor = this.color;
    this.color = "#0000FF"; // Cambiar a color azul

    // Volver al color original después de un corto período
    clearTimeout(this.flashTimeout);
    this.flashTimeout = setTimeout(() => {
      this.color = originalColor;
      this.isFlashing = false;
    }, 200); // El color cambia durante 200 ms
  }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach(circle => {
    circle.update(ctx, circles); // Actualizar cada círculo
  });
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10); // Ahora se generan 10 círculos
animate();
