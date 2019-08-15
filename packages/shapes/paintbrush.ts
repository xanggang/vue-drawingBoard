import { coordinates } from '../types'
import { style } from '../tools/style'

let currentLayerCtx: CanvasRenderingContext2D | null = null
/**
 * 画笔工具
 */
export default class PaintbrushClass {
  static shapeName = 'PaintbrushClass'

  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  paintbrushCanvas!: HTMLCanvasElement;
  paintbrushCxt!: CanvasRenderingContext2D;

  startPoint: { x: number, y: number } = { x: 0, y: 0};
  lastPoint: { x: number, y: number } = { x: 0, y: 0 };
  imgData: string = ''

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.paintbrushCanvas = <HTMLCanvasElement>document.querySelector('#paintbrush')
    this.paintbrushCxt = this.paintbrushCanvas.getContext("2d")!
  }

  handleMouseDown(event: MouseEvent) {
    // 如果编辑的图层切换了， 则清空画笔区1s
    if (this.ctx !== currentLayerCtx) {
      this.clearRectPaintbrushCxt()
      this.renderRectPaintbrushCxt()
      currentLayerCtx = this.ctx
    }
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = { x, y };
    this.renderPoint(this.lastPoint, this.ctx)
    this.renderPoint(this.lastPoint, this.paintbrushCxt)
  }

  handleMouseMove(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.renderLine(this.lastPoint.x, this.lastPoint.y, x, y, this.ctx);
    this.renderLine(this.lastPoint.x, this.lastPoint.y, x, y, this.paintbrushCxt);
    this.lastPoint = { x, y};
  }

  handleMouseUp(event: MouseEvent) {
    this.imgData = this.paintbrushCanvas.toDataURL()
  }

  renderPoint(pos: coordinates, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = style.fillColor;
    ctx.arc(pos.x, pos.y, style.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  renderLine(sx: number, sy: number, ex: number, ey: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = style.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = style.strokeColor;
    ctx.moveTo(sx,  sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.closePath();
  }

  clearRectPaintbrushCxt() {
    this.paintbrushCxt.clearRect(0, 0, 500, 500)
  }

  renderRectPaintbrushCxt() {
    let img = document.createElement('img');
    img.src = this.imgData
    this.paintbrushCxt.drawImage(img,0,0,500,500);
  }

  render() {
    this.ctx.save()
    let img = document.createElement('img');
    img.src = this.imgData
    this.ctx.drawImage(img,0,0,500,500);
    this.paintbrushCxt.drawImage(img,0,0,500,500);
  }
}
