import LayerClass from './layerClass'

interface previewImg {
  id: number,
  previewUrl: string
}

export class LayerManagementClass {
  // 全部图层的容器
  layerContainer!: Element;

  // 当前编辑中的图层
  currentLayer!: LayerClass;

  // 全部的图层
  layerList: LayerClass[] = [];

  zIndex: number = 0;

  // 图层的预览
  previewImgList: previewImg[] = [];

  constructor(layerContainer: Element) {
    this.layerContainer = layerContainer;
    this.createCanvas()
  }

  /**
   * 全部图层的预览
   */
  getPreviewImgList() {
    this.previewImgList = this.layerList
      .map(_ => {
        return {
          id: _.id,
          previewUrl: _.previewUrl,
          zIndex: _.zIndex
        }
      })
      .sort((a, b) => b.zIndex - a.zIndex)
  }

  /**
   * 创建新的图层
   */
  public createCanvas() {
    const canvas = document.createElement('canvas');
    this.layerContainer.appendChild(canvas);
    const layer = new LayerClass({
      canvas: canvas,
      zIndex: this.zIndex++
    });
    this.layerList.push(layer);
    this.currentLayer = layer
    debugger
    layer.on('updatePreview', this.getPreviewImgList.bind(this))
    layer.updatePreview()
  }

  /**
   * 删除当前图层
   * @param id
   */
  deleteLayer(id: number) {
    const index = this.layerList.findIndex(_ => _.id === id)
    const layer = this.layerList.splice(index, 1)
    this.layerContainer.removeChild(layer[0].canvas)
    if (id === this.currentLayer.id) {
      this.currentLayer = this.layerList[this.layerList.length - 1]
    }
    this.getPreviewImgList()
  }

  /**
   * 选择当前图层
   * @param id
   */
  selectCurrentLayer(id: number) {
   this.currentLayer= this.layerList.find(_ => _.id === id)!
  }

  /**  图层排序相关   **/
  /**
   * 图层置底
   * @param id
   */
  sendLayerToBack(id: number, zIndex: number) {
    this.layerList.forEach(item => {
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
    this.getPreviewImgList()
  }

  /**
   * 图层置顶
   * @param id
   */
  bringLayerToFront(id: number, zIndex: number) {
    this.layerList.forEach(item => {
      if (item.id === id) {
        item.zIndex = this.layerList.length
        return
      }
      if (zIndex > item.zIndex) {
        return
      }
      if (zIndex < item.zIndex) {
        item.zIndex--
      }
    })
    this.getPreviewImgList()
  }

  /**
   * 图层拖动排序
   * @param currentId
   * @param currentZindex
   * @param resId
   * @param resZindex
   */
  layerSorting (currentId: string, currentZindex: string, resId: string, resZindex: string) {
    this.layerList.find(_ => _.id === +currentId)!.zIndex = +resZindex;
    this.layerList.find(_ => _.id === + resId)!.zIndex = +currentZindex;
    this.getPreviewImgList()
  }
}
