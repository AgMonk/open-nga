<template>
  <div>
    <span>上次刷新时间:{{ loadTime }}</span>
    <span style="margin-left: 10px">当前时间:{{ currTime }}</span>
  </div>

</template>

<script>
export default {
  name: "clock",
  data() {
    return {
      loadTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      currTime: "",
      interval: undefined,
    }
  },
  mounted() {
    this.loadTime = new Date().format("yyyy-MM-dd hh:mm:ss")

    this.interval = setInterval(() => {
      this.currTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    }, 1000)
  },
  unmounted() {
    clearInterval(this.interval)
  },
  watch: {
    "load": {
      handler: function (e) {
        this.loadTime = e.format("yyyy-MM-dd hh:mm:ss")
      }
    }
  },
  props: ["load"]
}

</script>

<style scoped>

</style>