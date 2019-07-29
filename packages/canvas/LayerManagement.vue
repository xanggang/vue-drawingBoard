<template>
  <div class="container" ref="container">
    <transition-group name="flip-list" tag="div">
      <div class="img-bar"
           v-for="(layer, index) in previewImgList"
           :key="layer.id"
           :data-id="layer.id"
           :data-zindex="layer.zIndex"
           draggable="true"
           @dragstart.stop="ondragstart($event, index)"
           @dragend.stop="ondragend"
           @dragenter.stop="dragenter"
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
  import {Component, Prop, Vue, Inject, InjectReactive} from 'vue-property-decorator';
  import LayerClass from './Layer.vue'
  import { removeClass, addClass, once, on, off } from '../util/dom'
  import MainClass from './index.vue'
  import RightClickMenu from './RightClickMenu.vue'
  const Popper = require('../util/popper.js')

  // @ts-ignore
  const PopperClass = Vue.extend(RightClickMenu) as RightClickMenu

  interface previewImg {
    id: number,
    previewUrl: string
  }

  @Component({components: { RightClickMenu }})
  export default class LayerManagementClass extends Vue {

    $parent!: MainClass

    @Prop() layerList!: LayerClass[]

    @Prop() previewImgList!: previewImg[]

    @Inject()
    main!: MainClass;

    $refs!:{
      container: HTMLElement
    }

    // 当前拖动的元素
    currentImgElement: HTMLElement | null = null
    currentImgRightElement: HTMLElement | null = null

    popperJS: any = null
    rightClickMenu: RightClickMenu | null = null

    // 选择当前图层
    selectCurrentLayer(id: number) {
      this.main.selectCurrentLayer(id)
    }


    ondragstart($evente: any) {
      addClass($evente.currentTarget, 'active')
      this.currentImgElement = $evente.currentTarget
    }

    dragenter(e: any) {
      // TODO 迁移到main实例处理
      if (e.currentTarget === this.currentImgElement) return;
      const currentId = this.currentImgElement!.dataset.id!;
      const currentZindex = this.currentImgElement!.dataset.zindex!;

      const resId = e.currentTarget.dataset.id!;
      const resZindex= e.currentTarget.dataset.zindex!;

      this.main.layerList.find(_ => _.id === +currentId)!.zIndex = +resZindex;
      this.main.layerList.find(_ => _.id === + resId)!.zIndex = +currentZindex;
    }

    ondragend(e: any) {
      removeClass(e.currentTarget, 'active')
      this.currentImgElement = null
    }

    // 右键唤出菜单
    oncontextmenu(e:any, layer: LayerClass) {
      e.preventDefault();
      // 如果点击的是同一个图层
      if (e.currentTarget === this.currentImgRightElement) {
        return
      }
      // 如果其他图层的右键菜单展示中
      if (this.currentImgRightElement) {
        // 隐藏菜单
        this.removeRightMenu()
      }
      this.currentImgRightElement = e.currentTarget
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
        e.target,
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
    handleMenuEvent(e: any): void {
      if (!this.rightClickMenu) {
        return
      }

      // 如果点击的是同一个菜单， 怎什么也不做
      if (this.currentImgRightElement === e.currentTarget) {
        return
      }

      // 如果点击的位置在右键菜单内部
      if (!this.rightClickMenu.$el.contains(e.target as Node)) {
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
