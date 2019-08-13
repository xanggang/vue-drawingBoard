import { VLayerType } from '../types/layer'
import { LayerTool as LayerToolType} from './layer'

/**
 * 画笔工具
 */
export default class PaintbrushClass {
  radius: number = 0.5; //画点的半径
  lineWidth: number = 1 // 线宽
  fillColor: string = 'green'; //默认选中绿色填充色
  strokeColor: string = 'green'; //默认选中红色触发颜色
  lastPoint: { x: number, y: number} = { x: 0, y: 0 }
  layerTool!: LayerToolType

  constructor(layerTool: LayerToolType) {
    this.layerTool = layerTool
  }

  /**
   * 改变线宽
   * @param width
   */
  changePaintbrushWidth(width: number) {
    this.lineWidth = width
  }

  /**
   * 改变园直径
   * @param radius
   */
  changePaintbrushRadius(radius: number) {
    this.radius = radius
  }

  /**
   * 填充色
   * @param color
   */
  changePaintbrushFillColor(color: string) {
    this.fillColor = color
  }

  /**
   * 描边色
   * @param color
   */
  changePaintbrushStrokeColor(color: string) {
    this.strokeColor = color
  }

  handleMousedown(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = {x: x, y: y};
    const ctx = this.layerTool.currentVLayer.ctx
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  handleMousemove(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (!this.lastPoint.x) {
      this.lastPoint.x = x
      this.lastPoint.y = y
      return
    }
    let newPoint = {x: x, y: y};
    const ctx = this.layerTool.currentVLayer.ctx

    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.strokeColor;
    ctx.moveTo(this.lastPoint.x,  this.lastPoint.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.stroke();
    ctx.closePath();
    this.lastPoint = newPoint;
  }

  handleMouseup() {
    this.layerTool.currentVLayer.createdImg()
  }

  render() {

  }
}
