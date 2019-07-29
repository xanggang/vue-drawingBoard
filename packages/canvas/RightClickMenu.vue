<template>
  <div class="menu-list">
    <div @click="bringLayerToFront">移动到顶层</div>
    <div @click="sendLayerToBack">移动到底部</div>
    <div @click="deleteLayer">删除</div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
  import MainClass from './index.vue'

  @Component({})
  export default class RightClickMenu extends Vue {
    readonly id: number = NaN;
    readonly zIndex: number = NaN;

    @Inject()
    main!: MainClass;

    bringLayerToFront() {
      this.main.bringLayerToFront(this.id)

      this.$nextTick(() => {
        this.$emit('hideRightMenu')
      })
    }

    sendLayerToBack() {
      this.main.sendLayerToBack(this.id)
      this.$nextTick(() => {
        this.$emit('hideRightMenu')
      })
    }

    deleteLayer() {
      this.main.deleteLayer(this.id)
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
