interface canvasDom extends CanvasRenderingContext2D {

}


class Main {
  id: number = 0
  ctx !:canvasDom; //默认为绘图环境
  canvas !: HTMLCanvasElement; //默认画布
  canvasW: number = 0; //默认画布宽
  canvasH: number = 0; //默认画布高

  radius: number = 0.5; //画点的半径
  lineWidth: number = 1 // 线宽
  fillColor: string = 'green'; //默认选中绿色填充色
  strokeColor: string = 'green'; //默认选中红色触发颜色


  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.canvas = canvas
    this.canvasW = canvas.width
    this.canvasH = canvas.height
    this.id = new Date().valueOf()
  }

  /**
   * 画点的方法
   * @param x
   * @param y
   * @param radius
   */
  drawCircle(x: number, y: number, radius: number = this.radius) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = this.fillColor
    this.ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.strokeColor
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
   }

  clearCanvas() {
    this.ctx.clearRect(0,0,this.canvasW, this.canvasH);
  }
}

export default Main
