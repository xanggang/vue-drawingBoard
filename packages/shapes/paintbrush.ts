import { coordinates } from '../types'
import { style } from '../tools/style'
/**
 * 画笔工具
 */
export default class PaintbrushClass {
  static shapeName = 'PaintbrushClass'

  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;

  startPoint: { x: number, y: number } = { x: 0, y: 0};
  lastPoint: { x: number, y: number } = { x: 0, y: 0 };
  imgData: string = ''

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
  }

  handleMouseDown(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = { x, y };
    this.renderPoint(this.lastPoint)
  }

  handleMouseMove(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.renderLine(this.lastPoint.x, this.lastPoint.y, x, y);
    this.lastPoint = { x, y};
  }

  handleMouseUp(event: MouseEvent) {
    this.imgData = this.canvas.toDataURL()
  }

  renderPoint(pos: coordinates) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = style.fillColor;
    this.ctx.arc(pos.x, pos.y, style.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderLine(sx: number, sy: number, ex: number, ey: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = style.lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = style.strokeColor;
    this.ctx.moveTo(sx,  sy);
    this.ctx.lineTo(ex, ey);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  render() {
    this.ctx.save()
    let img = document.createElement('img');
    img.src = this.imgData
    this.ctx.drawImage(img,0,0,500,500);
  }
}
