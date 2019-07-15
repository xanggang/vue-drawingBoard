<template>
  <div class="container">
    <div class="img-bar"
         v-for="(layer, index) in layerList"
         :key="index"
         @mousedown="handleMousedown"
         @mousemove="handleMousemove"
         @mouseup="handleMouseup"
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

    painting: boolean = false

    currentImgElement!: HTMLElement | null

    handleMousedown(e: any) {
      this.currentImgElement = e.target
      console.log(e);
      console.log(e);
      this.painting = true
    }

    handleMousemove(e: MouseEvent) {
      if (!this.painting) return
      if (! this.currentImgElement.style) return
      this.currentImgElement.style.transform = `translate(${e.x}px, ${e.y}px)`
    }

    handleMouseup() {
      this.currentImgElement = null

    }
  }
</script>

<style scoped lang="less">
  .container {
    position: absolute;
    left: 520px;
    top: 20px;
    z-index: 1001;
    height: 504px;
    overflow: auto;
    transform: translate(20px, 20px);
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
