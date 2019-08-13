<template>
  <div class="container">
    <div class="canvas-bar"
         id="canvas-bar"
         ref="container"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
    >
      <input class="rang" @input.stop="handleRangInput" type="range" name="points" min="1" max="10" value="1" />
      <input class="palette" type="color" id="color" @input="handlePalette">
    </div>
    <VLayerManagement :layerManagement="layerManagement"></VLayerManagement>
    <button @click="clearCanvas">清除</button>
    <button @click="createCanvas">添加画布</button>
    <button @click="selectPen">画笔工具</button>
    <button @click="selectRac">矩形工具</button>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Provide, Prop } from 'vue-property-decorator'
  import { LayerManagementClass } from '../layer/layerManagementClass'
  import VLayerManagement from './VLayerManagement.vue'
  import { style } from '../tools/style'
  import { shapeManagement } from '../layer/shapeManagement'

  @Component({components: { VLayerManagement }})
  export default class DrawingBoard extends Vue {
    $refs !: {
      container: HTMLElement
    };

    layerManagement = {} as LayerManagementClass

    painting: boolean = false

    mounted() {
      this.layerManagement = new LayerManagementClass(this.$refs.container)
    }

    handleMousedown($event: MouseEvent) {
      this.painting = true
      this.layerManagement.currentLayer.handleMouseDown($event)
    }

    handleMousemove($event: MouseEvent) {
      if (!this.painting) return
      this.layerManagement.currentLayer.handleMouseMove($event)
    }

    handleMouseup($event: MouseEvent) {
      this.painting = false
      this.layerManagement.currentLayer.handleMouseUp($event)
    }

    createCanvas() {
      this.layerManagement.createCanvas()
    }

    // 改变画笔大小
    handleRangInput(event: any) {
      const value = event.target.value
      style.lineWidth = +value
      style.radius = +value / 2
    }

    // 选择画笔颜色
    handlePalette(event: any) {
      const value = event.target.value
      style.fillColor = value
      style.strokeColor = value
    }

    clearCanvas() {
      this.layerManagement.currentLayer.render()
    }

    /**
     * 选择画笔工具
     */
    selectPen() {
      shapeManagement.selectShape('PaintbrushClass')
    }

    selectRac() {
      shapeManagement.selectShape('Rect')
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
