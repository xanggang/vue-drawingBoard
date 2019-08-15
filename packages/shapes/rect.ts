import { coordinates } from '../types'
import StyleClass, { style } from '../tools/style'
import Position from '../tools/position'
/**
 * 画笔工具
 */
export default class PaintbrushClass {
  static shapeName = 'Rect'

  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;

  startPoint: { x: number, y: number } = { x: 0, y: 0};
  lastPoint: { x: number, y: number } = { x: 0, y: 0 };
  position!: Position
  style!: StyleClass

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.position = new Position({
      startPoint: this.startPoint,
      lastPoint: this.lastPoint
    })
    this.style = new StyleClass(style)
  }

  handleMouseDown(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = { x, y };
    this.startPoint = { x, y };
    this.position.updatePosition({
      startPoint: this.startPoint,
      lastPoint: this.lastPoint
    })
  }

  handleMouseMove(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (!this.lastPoint.x) {
      this.lastPoint = { x, y}
      return
    }
    this.lastPoint = { x, y};
    this.position.updatePosition({
      startPoint: this.startPoint,
      lastPoint: this.lastPoint
    })
    this.render()
  }

  handleMouseUp(event: MouseEvent) {
    // this.imgData = this.canvas.toDataURL()
  }

  render() {
    this.ctx.save()
    this.ctx.beginPath();
    this.ctx.fillStyle = this.style.fillColor;
    this.ctx.lineWidth = this.style.lineWidth;
    this.ctx.strokeStyle = this.style.strokeColor;
    this.ctx.strokeRect(this.position.sl, this.position.st, this.position.w, this.position.h);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
