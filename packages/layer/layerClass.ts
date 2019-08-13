import { addClass, setStyle } from '../utils/dom'
import PaintbrushClass from '../shapes/paintbrush'
import { shapeManagement } from './shapeManagement'

interface LayerConstructorType {
  canvas: HTMLCanvasElement
  zIndex: number
}


export default class LayerClass {
  canvas !: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  previewUrl: string = ''; // 图层预览
  readonly id: number = Number(new Date());
  _zIndex!: number;
  width: number = 500;
  height: number = 500;

  // 提供事件监听
  events: any = {}

  // 当前图层的全部元素集合
  shapesList: any[] = []
  // 当前编辑中的元素
  currentShape: PaintbrushClass | null = null;



  get zIndex () {
    return this._zIndex
  }

  set zIndex (zIndex: number) {
    debugger
    this._zIndex = zIndex
    this.updateZIndex()
  }

  constructor(option: LayerConstructorType) {
    this.canvas = option.canvas;
    this.ctx = this.canvas.getContext("2d")!
    this._zIndex = option.zIndex
    addClass(this.canvas, 'canvas')
    this.initStyle()
    this.canvas.dataset.id = '' + this.id
    this.canvas.dataset.zindex = '' + this.zIndex
  }

  /**
   * layermanagement在new出一个图层的时候， 添加一个时间， 在图层某些操作之后， 通知到layermanagement
   */
  on(eventName: string, callback: any) {
    if (this.events[eventName]) {
      return
    }
    this.events[eventName] = callback
  }

  /**
   * @param eventName
   * @param data
   */
  emit(eventName: string, data: any) {
    this.events[eventName] && this.events[eventName](data)
  }

  private initStyle() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    // setStyle(this.canvas, 'width', this.width + 'px')
    // setStyle(this.canvas, 'height', this.height + 'px')
    setStyle(this.canvas, 'zIndex', this._zIndex)
  }

  private updateZIndex () {
    this.canvas.dataset.zindex = '' + this.zIndex
    setStyle(this.canvas, 'zIndex', this._zIndex)
  }

  handleMouseDown(event: MouseEvent) {
    const shape = shapeManagement.currentShape
    this.currentShape = new shape(this.canvas);
    this.currentShape && this.currentShape.handleMouseDown(event)
    this.updatePreview()
  }

  handleMouseMove(event: MouseEvent) {
    this.render()
    if (!this.currentShape) return
    this.currentShape.handleMouseMove(event)
    this.updatePreview()
  }

  handleMouseUp(event: MouseEvent) {
    if (!this.currentShape) return
    this.currentShape.handleMouseUp(event)
    this.shapesList.push(this.currentShape)
    this.currentShape = null
  }

  render() {
    this.ctx.clearRect(0, 0, 500, 500)
    this.shapesList.forEach(shape => {
      if (shape === this.currentShape) return
      shape.render()
    })
  }

  // 生成缩略图
  updatePreview() {
    const img = this.canvas.toDataURL()
    this.previewUrl = img
    this.emit('updatePreview', null)
    return img
  }
}
