import { ShapeConstructor } from '../types/shape'

enum Shapetype {
  paint = 'paint', // 画笔
  image = 'image',
  text = 'text',
  line = 'line'
}

/**
 * 基础形状，包含类型、边界等信息
 */
export default class BaseShape {
  sl: number = 0 ;// 边界
  st: number = 0;
  sr: number = 0;
  sb: number = 0;
  type: string =  'shape';
  w: number = 0;
  h: number = 0;
  origin: { x: number, y: number} = { x: 0, y: 0};
  isFill: boolean = false; // 是否填充

  constructor(option: ShapeConstructor) {
    this.st = Math.min(option.startPoint.y, option.lastPoint.y);
    this.sb = Math.max(option.startPoint.y, option.lastPoint.y);
    this.sl = Math.min(option.startPoint.x, option.lastPoint.x);
    this.sr = Math.max(option.startPoint.x, option.lastPoint.x);

    this.w = Math.round(this.sr - this.sl);
    this.h = Math.round(this.sb - this.st);

    this.origin.x = Math.round(this.w / 2);
    this.origin.y = Math.round(this.h / 2);
  }
}
