// 图形工具管理

import PaintbrushClass from '../shapes/paintbrush'
import Rect from '../shapes/rect'

export class ShapeManagementClass {
  shapeList = [ PaintbrushClass, Rect ]
  currentShape: any = PaintbrushClass

  selectShape(name: string) {
    this.currentShape = this.shapeList.find(shape => shape.shapeName === name)!
  }
}

export let shapeManagement = new ShapeManagementClass()
