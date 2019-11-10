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
    <LayerManagement :layerList="layerList"
                     :previewImgList="previewImgList"
    ></LayerManagement>
  </div>
</template>

<script lang="ts">
  import 'reflect-metadata';

  let methodMap = new Map()
  let pathMap = new Map()

  const METHOD_METADATA = 'method';
  const PATH_METADATA = 'path';


  const Controller = (path: string): ClassDecorator => {
    return target => {
      Reflect.defineMetadata(PATH_METADATA, path, target);
    }
  }

  const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
      // 关于为什么参数是target,key,descriptor，可以看我之前写的一篇文章[装饰器(Decorator)在React中的应用](https://www.geekjc.com/post/5a630df9f6a6db2832a57368)
    }
  }

  const Get = createMappingDecorator('GET');
  const Post = createMappingDecorator('POST');

  @Controller('api')
  class A{

    mydata = 1

    @Get('/run')
    run() {
      console.log('run',this.mydata);
    }

    // @Get('/index')
    // index() {
    //   console.log('index', this.mydata);
    // }
  }

  const prototype = Object.getPrototypeOf(new A);
  const mathods = Object.getOwnPropertyNames(prototype)
    .filter(name => name !== 'constructor')
  mathods.map(obj => {
    let a = Reflect.getMetadata(METHOD_METADATA, prototype[obj])
    const instance = new prototype.constructor();
    instance[obj]()
  })

  // console.log(methodMap.get('class') === methodMap.get('run').constructor);







  import {Vue, Component, Provide, ProvideReactive} from 'vue-property-decorator'
  import Layer from './Layer.vue'
  import Paintbrush from './paintbrush'
  import LayerManagement from './LayerManagement.vue'

  // @ts-ignore
  const LayerClass = Vue.extend(Layer) as Layer

  @Component({components: {Layer, LayerManagement}})
  export default class DrawingBoard extends Vue {
    $refs!: {
      canvasBar: HTMLBaseElement
    };

    // 画笔、工具设置
    paintbrush: Paintbrush = new Paintbrush()

    painting: boolean = false; // 鼠标是否按下1
    lastPoint!: { x: number, y: number }; // 最后编辑的鼠标位置

    canvasWidth: number = 500
    canvasHeight: number = 500

    currentCanvasLayer!: Layer; // 当前编辑的图层, 一个vue组件
    layerList: Layer[] = []; // 全部的图层集合
    canvasElementList: HTMLCanvasElement[] = [];// 全部图层的dom元素的集合

    zIndex = 0 // 自增z-index

    @Provide()
    painSetting: Paintbrush = this.paintbrush;

    @Provide()
    main = this;

    // 所有的预览图片
    get previewImgList() {
      return this.layerList
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
      this.currentCanvasLayer.clearCanvas()
    }

    // 创建新的画布
    createCanvas() {
      // 创建一个新的vue画布实例1
      // @ts-ignore
      const layer = new LayerClass({
        parent: this,
        data: {
          zIndex: this.zIndex++,
          id: this.zIndex - 1
        },
      })
      layer.$mount()
      layer.$el.dataset.id = '' + layer.id
      this.$refs.canvasBar.appendChild(layer.$el) // 挂载
      this.canvasElementList.unshift(layer.$el)
      this.layerList.push(layer)
      this.currentCanvasLayer = layer
    }

    // 选中图层
    selectCurrentLayer(id: number) {
      this.currentCanvasLayer = this.layerList.find(_ => _.id === id)!
    }

    // 删除画布
    deleteLayer(id: number) {
      const layerIndex = this.layerList.findIndex(layer => layer.id === id)
      this.layerList.splice(layerIndex, 1)
      const elementIndex = this.canvasElementList.findIndex(el => +el.dataset.id! === id)
      const element = this.canvasElementList.splice(elementIndex, 1)
      this.$refs.canvasBar.removeChild(element[0])
    }

    // 图层置底
    sendLayerToBack(id: number) {
      this.layerList.forEach(item => {
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
      this.main.layerList.forEach(item => {
        if (item.id === id) {
          item.zIndex = this.main.layerList.length
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
