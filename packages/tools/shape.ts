import { LayerTool as LayerToolType } from "./layer";
import Paintbrush from '../tools/paintbrush'

export default class shapeTool {

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
}
