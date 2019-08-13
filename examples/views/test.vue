<template>
  <div>
    <canvas id="c" width="500px" height="500px" style="border: 1px solid pink"></canvas>
  </div>
</template>

<script>
  export default {
    name: "test",
    mounted() {
      fabric.Object.prototype.noScaleCache = false;
      debugger
      var canvas = new fabric.Canvas('c');
      var rect = new fabric.Rect({
        left: 100,
        top: 50,
        fill: '#D81B60',
        width: 50,
        height: 50,
        strokeWidth: 2,
        stroke: "#880E4F",
        rx: 10,
        ry: 10,
        angle: 45,
        scaleX: 3,
        scaleY: 3,
        hasControls: true
      });

      canvas.add(rect);
    }
  }
</script>

<style scoped>

</style>
