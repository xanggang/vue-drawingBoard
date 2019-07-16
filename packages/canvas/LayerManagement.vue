<template>
  <div class="container" @mouseup="handleMouseup" ref="container">
    <div class="img-bar"
         v-for="(layer, index) in layerList"
         :key="index"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
    >
      <img class="preview-img"
           width="50"
           height="50"
           :src="layer.previewUrl"
           alt="">
    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import LayerClass from './Layer.vue'

  @Component({})
  export default class LayerManagementClass extends Vue {
    @Prop() layerList!: LayerClass[]
    $refs!:{
      container: HTMLElement
    }

    painting: boolean = false

    currentImgElement!: HTMLElement | null

    // 容器下边线
    containerPositionBottom: number = 0;
    // 容器上边线
    containerPositionTop: number = 0;

    currentImgElementPositionTop: number = 0;



    handleMousedown(e: any) {
      this.painting = true
      this.currentImgElement = e.target
      this.currentImgElementPositionTop = this.currentImgElement!.offsetTop
      const container = this.$refs.container
      this.containerPositionBottom = container.offsetTop + container.offsetHeight
      this.containerPositionTop = container.offsetTop
    }

    handleMousemove(e: MouseEvent) {
      if (!this.painting) return
      if (!this.currentImgElement!.style) return
      this.currentImgElement!.style.transform = `translateY(${e.clientY - this.currentImgElementPositionTop}px)`
    }

    handleMouseup() {
      this.currentImgElement!.style.transform = `translateY(0px)`
      this.currentImgElement = null
      this.containerPositionTop = 0
      this.currentImgElementPositionTop = 0
      this.painting = false
    }
  }
</script>

<style scoped lang="less">
  .container {
    position: absolute;
    left: 520px;
    top: 10px;
    z-index: 1001;
    height: 504px;
    overflow: auto;
    border: 1px solid red;
    .img-bar {
      width: 50px;
      height: 50px;
      border: 1px solid red;
    }
    .preview-img {
      width: 100%;
      height: 100%;
    }
  }
</style>
