import { LayerTool as LayerToolType } from "./layer";
import Paintbrush from '../tools/paintbrush'
import BaseShape from './BaseShape'

export default class ShapeTool {
  startPoint: {x: number, y: number} = { x: 0, y: 0}
  lastPoint: { x: number, y: number} = { x: 0, y: 0 }
  layerTool!: LayerToolType
  paintbrush!: Paintbrush

  constructor(layerTool: LayerToolType, paintbrush: Paintbrush) {
    this.paintbrush = paintbrush
    this.layerTool = layerTool
  }

  handleMousedown(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = {x: x, y: y};
    this.startPoint = { x, y}
  }

  handleMousemove(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (!this.lastPoint.x) {
      this.lastPoint = { x, y}
      return
    }
    this.lastPoint = { x, y};
    const shape = new BaseShape({
      startPoint: this.startPoint,
      lastPoint: this.lastPoint,
      type: 'square'
    })
    this.render(shape)
  }

  handleMouseup(event: MouseEvent) {
    let x = event.offsetX;
    let y = event.offsetY;
    this.lastPoint = { x, y }
    const shape = new BaseShape({
      startPoint: this.startPoint,
      lastPoint: this.lastPoint,
      type: 'square'
    })
    this.layerTool.currentData.shapeList.push(shape)
    this.render(shape)
    const ctx = this.layerTool.currentVLayer.ctx
    ctx.save()
  }

  render(shape: BaseShape) {
    const ctx = this.layerTool.currentVLayer.ctx
    ctx.clearRect(0, 0, 500, 500)
    ctx.beginPath();
    ctx.fillStyle = this.paintbrush.fillColor;
    ctx.strokeRect(shape.sl, shape.st, shape.w, shape.h);
    ctx.closePath();
    ctx.stroke();
  }
}
