const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

let circlesDestroyed = 0; // Contador de círculos eliminados

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.dy = 1 * this.speed; // Solo se mueve verticalmente
    this.originalColor = color; // Color original
  }

  // Dibuja el círculo en el canvas
  draw(context) {
    context.beginPath();
    context.fillStyle = this.color; // Rellenar el círculo con su color
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.fill(); // Rellenar el círculo
    context.stroke();
    context.closePath();
  }

  // Actualiza la posición del círculo y verifica colisiones
  update(context) {
    this.draw(context);
    this.posY += this.dy;

    // Verificar si el círculo ha salido del canvas por la parte inferior
    if (this.posY - this.radius > window_height) {
      this.reset(); // Reiniciar el círculo en la parte superior
    }
  }

  // Reiniciar el círculo en la parte superior
  reset() {
    this.posY = -this.radius; // Justo después del margen superior
    this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
    this.dy = Math.random() * 2 + 1; // Nueva velocidad aleatoria
  }

  // Método para verificar si el clic del mouse está dentro del círculo
  isPointInside(x, y) {
    const dx = x - this.posX;
    const dy = y - this.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.radius;
  }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar un nuevo círculo
function generateCircle() {
  let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
  let x = Math.random() * (window_width - radius * 2) + radius;
  let y = -radius; // Iniciar justo después del margen superior
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
  let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
  let text = `C${circles.length + 1}`; // Etiqueta del círculo
  circles.push(new Circle(x, y, radius, color, text, speed));
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

  // Dibujar el contador de círculos eliminados
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Círculos eliminados: ${circlesDestroyed}`, window_width - 20, 30);

  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar un nuevo círculo cada 500 ms
setInterval(generateCircle, 500);

// Comenzar la animación
animate();

// Evento para detectar el clic del mouse
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Verificar si el clic está dentro de algún círculo
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].isPointInside(mouseX, mouseY)) {
      circles.splice(i, 1); // Eliminar el círculo del array
      circlesDestroyed++; // Incrementar el contador de círculos eliminados
      break; // Salir del bucle después de eliminar el círculo
    }
  }
});