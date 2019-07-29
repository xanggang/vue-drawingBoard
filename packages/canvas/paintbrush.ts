
export default class PaintbrushClass {
  radius: number = 0.5; //画点的半径
  lineWidth: number = 1 // 线宽
  fillColor: string = 'green'; //默认选中绿色填充色
  strokeColor: string = 'green'; //默认选中红色触发颜色

  changePaintbrushWidth(width: number) {
    this.lineWidth = width
  }

  changePaintbrushRadius(radius: number) {
    this.radius = radius
  }

  changePaintbrushFillColor(color: string) {
    this.fillColor = color
  }

  changePaintbrushStrokeColor(color: string) {
    this.strokeColor = color
  }
}
