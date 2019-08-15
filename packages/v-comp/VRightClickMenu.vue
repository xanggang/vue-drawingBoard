<template>
  <div class="menu-list">
    <div @click="bringLayerToFront">移动到顶层</div>
    <div @click="sendLayerToBack">移动到底部</div>
    <div @click="deleteLayer">删除</div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
  import { LayerManagementClass } from '../layer/layerManagementClass'

  @Component({})
  export default class VRightClickMenu extends Vue {
    readonly id: number = NaN;
    readonly zIndex: number = NaN;


    @Prop()
    layerManagement!: LayerManagementClass

    bringLayerToFront() {
      this.$parent.layerManagement.bringLayerToFront(this.id, this.zIndex)
      this.$nextTick(() => {
        this.$emit('hideRightMenu')
      })
    }

    sendLayerToBack() {
      this.$parent.layerManagement.sendLayerToBack(this.id, this.zIndex)
      this.$nextTick(() => {
        this.$emit('hideRightMenu')
      })
    }

    deleteLayer() {
      this.$parent.layerManagement.deleteLayer(this.id)
      this.$nextTick(() => {
        this.$emit('hideRightMenu')
      })
    }
  }
</script>

<style scoped lang="less">
  .menu-list {
    padding: 5px;
    box-shadow: pink;
    background-color: #fcfcfc;
    border: 1px solid #000;
    z-index: 9999;
    div {
      padding: 5px 10px;
      border-top: 1px solid red;
      &:hover {
        background-color: cadetblue;
      }
    }
  }
</style>
