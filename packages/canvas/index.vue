<template>
  <div class="container">
    <div class="canvas-bar"
         ref="canvasBar"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
    >
      <VLayer v-for="(layer) in layerTool.layerDataList"
             :zIndex="layer.zIndex"
             ref="layerList"
             :id="layer.id"
             :key="layer.id"></VLayer>

      <input class="rang" @input.stop="handleRangInput" type="range" name="points" min="1" max="10" value="1" />
      <input class="palette" type="color" id="color" @input="handlePalette">
    </div>
    <button @click="clearCanvas">清楚</button>
    <button @click="createCanvas">添加画布</button>
    <button @click="pen">pen</button>
    <VLayerManagement  />
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Provide} from 'vue-property-decorator'
  import VLayer from './VLayer.vue'
  import Paintbrush from '../tools/paintbrush'
  import VLayerManagement from './VLayerManagement.vue'
  import { layerDataType, VLayerType } from '../types/layer-management'
  import layerTool from '../tools/layer'
  import ShapeTool from '../tools/shape'

  @Component({components: {VLayer, VLayerManagement}})
  export default class DrawingBoard extends Vue {
    $refs!: {
      canvasBar: HTMLBaseElement,
      layerList: VLayerType[],
    };


    painting: boolean = false; // 鼠标是否按下

    canvasWidth: number = 500
    canvasHeight: number = 500

    @Provide()
    main = this;

    @Provide()
    layerTool = layerTool

    // 画笔工具
    @Provide()
    painSetting: Paintbrush = new Paintbrush(this.layerTool)

    shapeTool = new ShapeTool(this.layerTool, this.painSetting)


    mounted() {
      this.createCanvas()
    }

    pen() {
      // this.layerTool.changeNum(Math.random() * 1000)
    }

    handleMousedown($event: MouseEvent) {
      this.painting = true
      this.shapeTool.handleMousedown($event)
    }

    handleMousemove($event: MouseEvent) {
      if (!this.painting) return
      this.shapeTool.handleMousemove($event)
    }

    handleMouseup($event: MouseEvent) {
      this.painting = false
      this.shapeTool.handleMouseup($event)
    }

    // 改变画笔大小
    handleRangInput(event: any) {
      const value = event.target.value
      this.painSetting.changePaintbrushWidth(+value)
      this.painSetting.changePaintbrushRadius(+value / 2)
    }

    // 选择画笔颜色
    handlePalette(event: any) {
      const value = event.target.value

      this.painSetting.changePaintbrushFillColor(value)
      this.painSetting.changePaintbrushStrokeColor(value)
    }

    // 清楚画布
    clearCanvas() {
      // this.currentLayer!.clearCanvas()
    }

    // 创建新的画布
    createCanvas() {
      // 创建一个新的vue画布实例
      const id = this.layerTool.createCanvas()
      this.$nextTick(() => {
        const layer = this.$refs.layerList.find(_ => id === _.id)!
        this.layerTool.collectVLayer(layer)
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
