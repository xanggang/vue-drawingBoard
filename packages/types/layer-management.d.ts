import Vue from 'vue'

export type previewImgType = {
  id: number,
  previewUrl: string,
  zIndex: number
}

export type layerDataType = {
  id: number,
  zIndex: number
}


export declare class VLayerType extends Vue {
  readonly id: number
  readonly $el: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D; //默认绘图环境
  readonly canvas: HTMLCanvasElement; //默认画布
  previewUrl: string;
  readonly zIndex: number
  readonly width: number
  readonly height: number
  styleSetting () : any
  createdImg (): void
  drawCircle(x: number, y: number, radius: number): void
  drawLine(x1: number, y1: number, x2: number, y2: number): void
}
