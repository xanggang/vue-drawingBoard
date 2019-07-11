<template>
  <div>
    <div class="canvas-bar"
         ref="canvasBar"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
      >
      <input class="rang" @input.stop="handleRangInput" type="range" name="points" min="1" max="10" value="1" />
      <input class="palette" type="color" id="color" @input="handlePalette">
      <div class="canvas-list">
        <div v-for="(canvasElement, index) in canvasElementList"
            :key="index"
            @click.stop="selectCurrentCanvas(canvasElement, index)"
        >{{index}}</div>
      </div>
    </div>
    <button @click="clearCanvas">清楚</button>
    <button @click="createCanvas">添加画布</button>
    <button @click="deleteCanvas">删除画布</button>
  </div>
</template>

<script>
  import Main from './main'
  import { addClass } from '../util/dom.js'
  export default {
    name: 'mycanvas',
    data() {
      return {
        canvasWidth: 500,
        canvasHeight: 500,
        currentCanvas: null, // 当前编辑的图层, ctx对象
        layerList: [], // 全部的ctx集合
        canvasElementList: [], // 全部 的dom元素的集合
        currentIndex: 0, // 当前编辑的索引
      }
    },
    mounted() {
      this.createCanvas()
    },
    methods: {
      handleMousedown(e) {
        this.currentCanvas.painting = true
        let x = e.clientX;
        let y = e.clientY;
        this.currentCanvas.lastPoint = {x: x, y: y};
        this.currentCanvas.drawCircle(x, y, 0);
      },
      handleMousemove(e) {
        if (!this.currentCanvas.painting) return
        let x = e.clientX;
        let y = e.clientY;
        let newPoint = {x: x, y: y};
        this.currentCanvas.drawLine(this.currentCanvas.lastPoint.x, this.currentCanvas.lastPoint.y, newPoint.x, newPoint.y);
        this.currentCanvas.lastPoint = newPoint;
      },
      handleMouseup(e) {
        this.currentCanvas.painting = false
      },
      // 改变画笔大小
      handleRangInput({target: {value}}) {
        this.currentCanvas.lineWidth = +value
        this.currentCanvas.radius = +value / 2
      },
      // 选择画笔颜色
      handlePalette({target: {value}}) {
        this.currentCanvas.fillColor = value
        this.currentCanvas.strokeColor = value
      },
      // 清楚画布
      clearCanvas() {
        this.currentCanvas.clearCanvas()
      },
      // 创建新的画布
      createCanvas() {
        let canvasElement = document.createElement('canvas')
        canvasElement.width = this.canvasWidth
        canvasElement.height = this.canvasHeight

        addClass(canvasElement, 'canvas')

        this.$refs.canvasBar.appendChild(canvasElement)

        this.canvasElementList.push(canvasElement)

        const ctx = canvasElement.getContext("2d")
        const currentCanvas = new Main(canvasElement, ctx)
        this.currentCanvas = currentCanvas
        this.layerList.push(currentCanvas)
        this.currentIndex = this.canvasElementList.length - 1
      },
      deleteCanvas() {
        this.layerList.splice(this.currentIndex, 1)
        const dom = this.canvasElementList.splice(this.currentIndex, 1)
        this.$refs.canvasBar.removeChild(dom[0])
        this.currentIndex = this.canvasElementList.length - 1
      },
      selectCurrentCanvas(canvasElement, index) {
        console.log(canvasElement, index);
        this.currentCanvas = this.layerList[index]
        this.currentIndex = index
      },
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
    .canvas-list {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1001;
      li {
        width: 40px;
        height: 40px;
        background-color: pink;
      }
    }
  }
</style>
