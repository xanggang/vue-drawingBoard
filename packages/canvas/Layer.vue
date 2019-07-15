<template>
  <canvas class="canvas"
          :width="main.canvasWidth"
          :height="main.canvasHeight"
          :style="styleSetting"
  ></canvas>
</template>



<script lang="ts">
  import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
  import MainClass from './index.vue'
  import Paintbrush from './paintbrush'

  @Component({})
  export default class LayerClass extends Vue {
    $el!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D; //默认为绘图环境
    canvas !: HTMLCanvasElement; //默认画布

    id: number = 0; // id
    previewUrl: string = ''

    @Inject()
    painSetting!: Paintbrush;

    @Inject()
    main!: MainClass;

    @Prop(Number) zIndex!: number;

    get styleSetting() {
      return {
        'z-index': this.zIndex
      }
    }

    created() {
      this.id = new Date().valueOf()
    }

    mounted() {
      this.canvas = this.$el
      this.ctx = this.$el.getContext("2d")!
    }

    /**
     * 画点的方法
     * @param x
     * @param y
     * @param radius
     */
    drawCircle(x: number, y: number, radius: number = this.painSetting.radius) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = this.painSetting.fillColor;
      this.ctx.arc(x, y, this.painSetting.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.painSetting.lineWidth;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.painSetting.strokeColor;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    clearCanvas() {
      this.ctx.clearRect(0,0,this.main.canvasWidth, this.main.canvasHeight);
    }

    // 生成缩略图
    createdImg() {
      const img = this.canvas.toDataURL()
      this.previewUrl = img
    }
  }
</script>

<style>
  .container {

  }
</style>
