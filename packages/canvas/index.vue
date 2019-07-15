<template>
  <div class="container">
    <!--<Layer></Layer>-->
    <div class="canvas-bar"
         ref="canvasBar"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
      >
      <input class="rang" @input.stop="handleRangInput" type="range" name="points" min="1" max="10" value="1" />
      <input class="palette" type="color" id="color" @input="handlePalette">
    </div>
    <button @click="clearCanvas">清楚</button>
    <button @click="createCanvas">添加画布</button>
    <button @click="deleteCanvas">删除画布1</button>
    <LayerManagement :layerList="layerList"></LayerManagement>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Provide } from 'vue-property-decorator'
  import Layer from './Layer.vue'
  import Paintbrush from './paintbrush'
  import LayerManagement from './LayerManagement.vue'

  // @ts-ignore
  const LayerClass = Vue.extend(Layer) as Layer

  @Component({ components: { Layer, LayerManagement } })
  export default class DrawingBoard extends Vue {
    $refs!: {
      canvasBar: HTMLBaseElement
    };

    // 画笔、工具设置
    paintbrush: Paintbrush = new Paintbrush()

    painting: boolean = false; // 鼠标是否按下1
    lastPoint!: {x: number, y: number}; // 最后编辑的鼠标位置

    canvasWidth: number =  500
    canvasHeight: number = 500

    currentCanvasLayer!: Layer; // 当前编辑的图层, 一个vue组件
    layerList: Layer[] =  []; // 全部的图层集合
    canvasElementList: HTMLCanvasElement[] = [];// 全部图层的dom元素的集合

    currentIndex: number =  0 // 当前编辑的索引
    zIndex =  1 // 自增z-index

    @Provide()
    painSetting: Paintbrush = this.paintbrush;

    @Provide()
    main = this;

    mounted() {
      this.createCanvas()
    }

    handleMousedown(e: MouseEvent) {
      this.painting = true
      let x = e.offsetX;
      let y = e.offsetY;
      this.lastPoint = {x: x, y: y};
      this.currentCanvasLayer.drawCircle(x, y, 0);
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
      this.currentCanvasLayer.drawLine(this.lastPoint.x,
        this.lastPoint.y, newPoint.x, newPoint.y);
      this.lastPoint = newPoint;
    }

    handleMouseup() {
      this.painting = false
      this.currentCanvasLayer.createdImg()
    }

    // 改变画笔大小
    handleRangInput(event: any) {
      const value = event.target.value
      this.paintbrush.lineWidth = +value
      this.paintbrush.radius = +value / 2
    }

    // 选择画笔颜色
    handlePalette(event: any) {
      const value = event.target.value
      this.paintbrush.fillColor = value
      this.paintbrush.strokeColor = value
    }

    // 清楚画布
    clearCanvas() {
      this.currentCanvasLayer.clearCanvas()
    }

    // 创建新的画布
    createCanvas() {
      // 创建一个新的vue画布实例1
      // @ts-ignore
      const layer = new LayerClass({
        parent: this,
        propsData: { zIndex: this.zIndex++}
      })
      layer.$mount()
      this.$refs.canvasBar.appendChild(layer.$el) // 挂载
      this.canvasElementList.push(layer.$el)
      this.layerList.push(layer)
      this.currentCanvasLayer = layer
      this.currentIndex = this.layerList.length - 1
    }


    deleteCanvas() {
      this.layerList.splice(this.currentIndex, 1)
      const dom = this.canvasElementList.splice(this.currentIndex, 1)
      this.$refs.canvasBar.removeChild(dom[0])
      this.currentIndex = this.canvasElementList.length - 1
    }

    selectCurrentCanvas(layer: Layer, index:number) {
      this.currentCanvasLayer = layer
      this.currentIndex = index
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
