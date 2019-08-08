import Vue from 'vue'
import { layerDataType, VLayerType } from '../types/layer-management'

/**
 * 图层工具， 所有图层的管理中心
 */
export class LayerTool {

  /**
   * 当前编辑的图层实例
   */
  currentVLayer: VLayerType = {} as VLayerType

  /**
   * 全部图层的vue实例， 不允许修改内部属性
   */
  VLayerInstanceList: VLayerType[] = []

  /**
   * 图层实例的数据对象， 通过props改变内部属性
   */
  layerDataList: layerDataType[] = []

  /**
   * 自增的index
   */
  zIndex: number = 0

  /**
   * 向layerDataList添加数据， 利用v-for渲染canvas图层
   * 将id返回， 用户收集添加的这个图层
   */
  public createCanvas(): number {
    const id = Number(new Date())
    this.layerDataList.push({
      zIndex: this.zIndex++,
      id:id
    })
    return id
  }

  /**
   * 图层渲染之后将其收集
   * @param layer
   */
  public collectVLayer(layer: VLayerType): void {
    this.currentVLayer = layer
    this.VLayerInstanceList.push(layer)
  }

  /**
   * 选择当前操控的图层
   * @param id
   */
  public selectCurrentLayer(id: number) {
    this.currentVLayer = this.VLayerInstanceList.find(_ => _.id === id)!
    console.log(this.currentVLayer.id);
  }

  /**
   * 删除当前图层
   * @param id
   */
  deleteLayer(id: number) {
    const layerInstanceIndex = this.VLayerInstanceList.findIndex(layer => layer.id === id)
    this.VLayerInstanceList.splice(layerInstanceIndex, 1)
    const layerDataIndex = this.layerDataList.findIndex(layer => layer.id === id)
    this.layerDataList.splice(layerDataIndex, 1)
  }

  /**
   * 图层置底
   * @param id
   */
  sendLayerToBack(id: number, zIndex: number) {
    this.layerDataList.forEach(item => {
      if (item.id === id) {
        item.zIndex = 0
        return
      }
      if (zIndex > item.zIndex) {
        item.zIndex++
      }
      if (zIndex < item.zIndex) {
        return
      }
    })
  }

  /**
   * 图层置顶
   * @param id
   */
  bringLayerToFront(id: number, zIndex: number) {
    this.layerDataList.forEach(item => {
      if (item.id === id) {
        item.zIndex = this.layerDataList.length
        return
      }
      if (zIndex > item.zIndex) {
        return
      }
      if (zIndex < item.zIndex) {
        item.zIndex--
      }
    })
  }
}

export default new LayerTool()
