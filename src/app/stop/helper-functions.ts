export class HelperCanvas {
  canvas =  null;
  canvasContext = null;
  fontFamily = 'Arial';
  resolution = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.drawBitmap = this.drawBitmap.bind(this);
    this.drawFilledRect = this.drawFilledRect.bind(this);
    this.drawOutlineRect = this.drawOutlineRect.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawFilledCircle = this.drawFilledCircle.bind(this);
    this.drawBitmap = this.drawBitmap.bind(this);
    this.writeText = this.writeText.bind(this);

    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext('2d');

    // const resolution = this.pixelRatio();
    this.resolution = 1.885;

    this.canvas.width = canvas.width * this.resolution;
    this.canvas.height = canvas.height * this.resolution;
    this.canvas.style.width = canvas.width + 'px';
    this.canvas.style.height = canvas.height + 'px';
    this.canvas.getContext('2d').setTransform(this.resolution, 0, 0, this.resolution, 0, 0);

    this.canvasContext = this.canvas.getContext('2d');
  }

  pixelRatio() {
    const dpr = window.devicePixelRatio || 1;
    const bsr = this.canvasContext.webkitBackingStorePixelRatio ||
      this.canvasContext.mozBackingStorePixelRatio ||
      this.canvasContext.msBackingStorePixelRatio ||
      this.canvasContext.oBackingStorePixelRatio ||
      this.canvasContext.backingStorePixelRatio || 1;

    return dpr / bsr;
  }

  drawBitmap(useBitmap, x: number, y: number, angle: number) {
    this.canvasContext.save();
    this.canvasContext.translate(x, y);
    this.canvasContext.rotate(angle);
    this.canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
    this.canvasContext.restore();
  }

  drawFilledRect(x: number, y: number, width: number, height: number, color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.fillRect(x, y, width, height);
  }

  drawOutlineRect(x: number, y: number, width: number, height: number, color: string) {
    this.canvasContext.strokeStyle = color;
    this.canvasContext.strokeRect(x, y, width, height);
  }

  drawRoundedRect(
    x: number, y: number, width: number, height: number, radius: number, color: string
  ) {
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = color;
    this.canvasContext.moveTo(x + width - radius, y + height);
    this.canvasContext.arcTo(x, y + height, x, y, radius);
    this.canvasContext.arcTo(x, y, x + width, y, radius);
    this.canvasContext.arcTo(x + width, y, x + width, y + height, radius);
    this.canvasContext.arcTo(x + width, y + height, x, y + height, radius);
    this.canvasContext.stroke();
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number, color: string) {
    this.canvasContext.save();
    this.canvasContext.beginPath();
    this.canvasContext.lineWidth = lineWidth;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.moveTo(x1, y1);
    this.canvasContext.lineTo(x2, y2);
    this.canvasContext.stroke();
    this.canvasContext.restore();
  }

  drawDashedLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number, color: string, dashParams) {
    this.canvasContext.setLineDash(dashParams);
    this.drawLine(x1, y1, x2, y2, lineWidth, color);
    this.canvasContext.setLineDash([]);
  }

  drawFilledCircle(centerX: number, centerY: number, radius: number, color: string) {
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = color;
    this.canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    this.canvasContext.fill();
  }

  writeText(text: string, x: number, y: number, fontSize: number, color: string,
            font?: string) {
    this.canvasContext.fillStyle = color;
    if (font) {
      this.canvasContext.font = font;
    } else {
      this.canvasContext.font = fontSize + 'px ' + this.fontFamily;
    }
    this.canvasContext.fillText(text, x, y);
  }
}


// Mouse handler
// let mouseX, mouseY;
// canvas.addEventListener('mousemove', function (event) {
//         let rect = canvas.getBoundingClientRect();
//         let root = document.documentElement;

//         mouseX = event.clientX - rect.left - root.scrollLeft;
//         mouseY = event.clientY - rect.top - root.scrollTop;
//     });
