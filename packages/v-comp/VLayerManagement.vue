<template>
  <div class="container" ref="container">
    <transition-group name="flip-list" tag="div">
      <div class="img-bar"
           v-for="(layer, index) in layerManagement.previewImgList"
           :key="layer.id"
           :data-id="layer.id"
           :data-zindex="layer.zIndex"
           :class="[{'select': layerManagement.currentLayer && layerManagement.currentLayer.id === layer.id}]"
           draggable="true"
           @dragstart.stop="ondragstart($event, index)"
           @dragend.stop="ondragend"
           @dragenter.stop="dragenter"
           @dragleave.stop="dragleave"
           @contextmenu="oncontextmenu($event, layer)"
           @click="selectCurrentLayer(layer.id)"
      >
        <img
            class="preview-img"
            width="50"
            height="50"
            :src="layer.previewUrl">
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
  import LayerClass from './VLayer.vue'
  import { removeClass, addClass, once, on, off } from '../utils/dom'
  import RightClickMenu from './VRightClickMenu.vue'
  import { LayerManagementClass } from '../layer/layerManagementClass'
  const Popper = require('../utils/popper.js')
  // @ts-ignore
  const PopperClass = Vue.extend(RightClickMenu) as RightClickMenu

  interface previewImg {
    id: number,
    previewUrl: string
  }

  @Component({components: { RightClickMenu }})
  export default class VLayerManagement extends Vue {

    @Prop()
    layerManagement!: LayerManagementClass

    // 当前拖动的元素
    currentImgElement: HTMLElement | null = null
    currentImgRightElement: HTMLElement | null = null

    popperJS: any = null
    rightClickMenu: RightClickMenu | null = null


    // 选择当前图层
    selectCurrentLayer(id: number) {
      this.layerManagement.selectCurrentLayer(id)
    }


    ondragstart($evente: any) {
      addClass($evente.currentTarget, 'active')
      this.currentImgElement = $evente.currentTarget
    }

    dragenter($evente: any) {
      // TODO 迁移到LayerTool实例处理
      if ($evente.currentTarget === this.currentImgElement) return;
      addClass($evente.currentTarget, 'active')
      const currentId = this.currentImgElement!.dataset.id!;
      const currentZindex = this.currentImgElement!.dataset.zindex!;
      const resId = $evente.currentTarget.dataset.id!;
      const resZindex= $evente.currentTarget.dataset.zindex!;
      this.layerManagement.layerSorting(currentId, currentZindex, resId, resZindex)
    }

    dragleave($evente: any) {
      removeClass($evente.currentTarget, 'active')
    }

    ondragend($evente: any) {
      removeClass($evente.currentTarget, 'active')
      this.currentImgElement = null
    }

    // 右键唤出菜单
    oncontextmenu($evente:any, layer: LayerClass) {
      $evente.preventDefault();
      // 如果点击的是同一个图层
      if ($evente.currentTarget === this.currentImgRightElement) {
        return
      }
      // 如果其他图层的右键菜单展示中
      if (this.currentImgRightElement) {
        // 隐藏菜单
        this.removeRightMenu()
      }
      this.currentImgRightElement = $evente.currentTarget
      // @ts-ignore
      const rightClickMenu = this.rightClickMenu = new PopperClass({
        data: {
          id: layer.id,
          zIndex: layer.zIndex
        },
        parent: this,
      })

      rightClickMenu.$mount()
      rightClickMenu.$once('hideRightMenu', this.removeRightMenu)


      document.body.appendChild(rightClickMenu.$el)
      // 使用popperjs定位右键菜单
      this.popperJS = new Popper(
        $evente.target,
        rightClickMenu.$el,
        {
          placement: 'bottom-start',
          offsets:{
            top: 10,
            left:10
          }
        }
      )
      setTimeout(() => {
        on(document.body, 'click', this.handleMenuEvent)
        on(document.body, 'contextmenu', this.handleMenuEvent)
      })

    }

    // 隐藏右键菜单
    handleMenuEvent($evente: any): void {
      if (!this.rightClickMenu) {
        return
      }

      // 如果点击的是同一个菜单， 怎什么也不做
      if (this.currentImgRightElement === $evente.currentTarget) {
        return
      }

      // 如果点击的位置在右键菜单内部
      if (!this.rightClickMenu.$el.contains($evente.target as Node)) {
        this.removeRightMenu()
      }
    }

    // 移除右键菜单
    removeRightMenu() {
      if (!this.rightClickMenu) {
        return
      }
      this.rightClickMenu.$destroy()
      this.popperJS = null
      this.currentImgRightElement = null
      document.body!.removeChild(this.rightClickMenu.$el)
      off(document.body, 'click', this.handleMenuEvent)
      off(document.body, 'contextmenu', this.handleMenuEvent)
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

<style>
  .active {
    background-color: pink;
  }
  .select {
    background-color: aqua;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to
    /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .flip-list-move {
    transition: transform 0.1s;
  }
</style>
