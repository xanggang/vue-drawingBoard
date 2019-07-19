<template>
  <div class="menu-list">
    <div>移动到顶层</div>
    <div>移动到底部</div>
    <div>删除</div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({})
  export default class RightClickMenu extends Vue {
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
