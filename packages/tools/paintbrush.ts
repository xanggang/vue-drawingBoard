import { VLayerType } from '../types/layer-management'
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
    this.layerTool.currentVLayer.drawCircle(x, y, 0);
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
    this.layerTool.currentVLayer.drawLine(this.lastPoint.x,
      this.lastPoint.y, newPoint.x, newPoint.y);
    this.lastPoint = newPoint;
  }

  handleMouseup() {
    this.layerTool.currentVLayer.createdImg()
  }
}
