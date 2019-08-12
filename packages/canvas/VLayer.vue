<template>
  <canvas class="canvas"
          :width="width + 'px'"
          :height="height + 'px'"
          :data-id="id"
          :style="styleSetting"
  ></canvas>
</template>



<script lang="ts">
  import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
  import MainClass from './index.vue'
  import Paintbrush from '../tools/paintbrush'

  @Component({})
  export default class VLayer extends Vue {

    $el!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D; //默认为绘图环境
    canvas !: HTMLCanvasElement; //默认画布

    previewUrl: string = ''

    @Inject()
    painSetting!: Paintbrush;

    @Inject()
    main!: MainClass;


    @Prop() id!: number
    @Prop() zIndex!: number
    @Prop({default: 500}) width!: number
    @Prop({default: 500}) height!: number

    get styleSetting() {
      return {
        'z-index': this.zIndex
      }
    }

    mounted() {
      this.canvas = this.$el
      this.ctx = this.$el.getContext("2d")!
      this.createdImg()
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
