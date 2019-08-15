import { StyleConstructor } from '../types'

const defaultStyle = {
  radius: 5, //画点的半径
  lineWidth: 10, // 线宽
  fillColor: 'green', //默认选中绿色填充色
  strokeColor: 'green', //默认选中红色触发颜色
}


export default class StyleClass {
  radius!: number ;
  lineWidth!: number;
  fillColor!: string;
  strokeColor!: string;

  constructor(option: StyleConstructor = defaultStyle) {
    this.radius = option.radius;
    this.lineWidth = option.lineWidth;
    this.fillColor = option.fillColor;
    this.strokeColor = option.strokeColor
  }
}

export let style = new StyleClass()
