import { ToolType } from '../types/baseTool'

export default class BaseTool {

  _formatMouseEvent(e: MouseEvent) {
    return [e.offsetX, e.offsetY]
  }
}
