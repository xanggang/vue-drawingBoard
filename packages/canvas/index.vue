<template>
  <div class="container">
    <div class="canvas-bar"
         ref="canvasBar"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
    >
      <Layer v-for="(layer) in layerDataList"
             :zIndex="layer.zIndex"
             ref="layerList"
             :id="layer.id"
             :key="layer.id"></Layer>

      <input class="rang" @input.stop="handleRangInput" type="range" name="points" min="1" max="10" value="1" />
      <input class="palette" type="color" id="color" @input="handlePalette">
    </div>
    <button @click="clearCanvas">清楚</button>
    <button @click="createCanvas">添加画布</button>
    <LayerManagement :previewImgList="previewImgList" :currentLayer="currentLayer"></LayerManagement>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Provide, Prop} from 'vue-property-decorator'
  import Layer from './Layer.vue'
  import Paintbrush from './paintbrush'
  import LayerManagement from './LayerManagement.vue'
  import { After } from '../util/decorators'
  import { previewImgType, layerDataType } from '../types/layer-management'

  @Component({components: {Layer, LayerManagement}})
  export default class DrawingBoard extends Vue {
    $refs!: {
      canvasBar: HTMLBaseElement,
      layerList: Layer[],
    };

    // 画笔、工具设置
    paintbrush: Paintbrush = new Paintbrush()

    painting: boolean = false; // 鼠标是否按下
    lastPoint!: { x: number, y: number }; // 最后编辑的鼠标位置

    canvasWidth: number = 500
    canvasHeight: number = 500

    currentLayer: Layer | null = null; // 当前编辑的图层, 一个vue组件

    layerInstanceList: Layer[] = []; // 全部图层实例的集合， 可以调用方法， 不可修改数据
    layerDataList: layerDataType[] = [] // 全部图层数据的集合， 通过props修改数据

    zIndex = 0 // 自增z-index


    @Provide()
    painSetting: Paintbrush = this.paintbrush;

    @Provide()
    main = this;

    // 获取所有的预览图片
    get previewImgList() {
      return this.layerInstanceList
        .map(_ => {
          return {
            id: _.id,
            previewUrl: _.previewUrl,
            zIndex: _.zIndex
          }
        })
        .sort((a, b) => b.zIndex - a.zIndex)
    }

    mounted() {
      this.createCanvas()
    }

    handleMousedown(e: MouseEvent) {
      this.painting = true
      let x = e.offsetX;
      let y = e.offsetY;
      this.lastPoint = {x: x, y: y};
      this.currentLayer!.drawCircle(x, y, 0);
    }

    handleMousemove(e: MouseEvent) {
      if (!this.painting) return
      let x = e.offsetX;
      let y = e.offsetY;
      if (!this.lastPoint.x) {
        this.lastPoint.x = x
        this.lastPoint.y = y
        return
      }
      let newPoint = {x: x, y: y};
      this.currentLayer!.drawLine(this.lastPoint.x,
        this.lastPoint.y, newPoint.x, newPoint.y);
      this.lastPoint = newPoint;
    }

    handleMouseup() {
      this.painting = false
      this.currentLayer!.createdImg()
    }

    // 改变画笔大小
    handleRangInput(event: any) {
      const value = event.target.value
      this.paintbrush.changePaintbrushWidth(+value)
      this.paintbrush.changePaintbrushRadius(+value / 2)
    }

    // 选择画笔颜色
    handlePalette(event: any) {
      const value = event.target.value

      this.paintbrush.changePaintbrushFillColor(value)
      this.paintbrush.changePaintbrushStrokeColor(value)
    }

    // 清楚画布
    clearCanvas() {
      this.currentLayer!.clearCanvas()
    }

    // 创建新的画布
    createCanvas() {
      // 创建一个新的vue画布实例1
      const id = Number(new Date())
      this.layerDataList.push({
        zIndex: this.zIndex++,
        id:id
      })

      this.$nextTick(() => {
        const layer = this.$refs.layerList.find(_ => id === _.id)!
        this.layerInstanceList.push(layer)
        this.currentLayer = layer
      })
    }

    // 选中图层
    selectCurrentLayer(id: number) {
      this.currentLayer = this.layerInstanceList.find(_ => _.id === id)!
    }

    // 删除画布
    deleteLayer(id: number) {
      const layerInstanceIndex = this.layerInstanceList.findIndex(layer => layer.id === id)
      this.layerInstanceList.splice(layerInstanceIndex, 1)
      const layerDataIndex = this.layerDataList.findIndex(layer => layer.id === id)
      this.layerDataList.splice(layerDataIndex, 1)
    }

    // 图层置底
    sendLayerToBack(id: number) {
      this.layerDataList.forEach(item => {
        if (item.id === id) {
          item.zIndex = 0
          return
        }
        if (this.zIndex > item.zIndex) {
          item.zIndex++
        }
        if (this.zIndex < item.zIndex) {
          return
        }
      })
    }

    // 图层置顶
    bringLayerToFront(id: number) {
      this.layerDataList.forEach(item => {
        if (item.id === id) {
          item.zIndex = this.layerDataList.length
          return
        }
        if (this.zIndex > item.zIndex) {
          return
        }
        if (this.zIndex < item.zIndex) {
          item.zIndex--
        }
      })
    }
  }

</script>

<style lang="less">
  .canvas-bar {
    width: 502px;
    height: 502px;
    border: 1px solid #999;
    position: relative;
    .rang {
      position: absolute;
      left: -130px;
      bottom: 245px;
      width: 300px;
      transform: rotate(-90deg);
      z-index: 1001;
    }
    .canvas {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .palette {
      position: absolute;
      bottom: 10px;
      left: 10px;
      z-index: 1000;
    }
  }

  .canvas-list {
    position: absolute;
    left: 520px;
    top: 20px;
    z-index: 1001;
    height: 504px;
    overflow: auto;
    div {
      width: 50px;
      height: 50px;
      border: 1px solid red;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
</style>
