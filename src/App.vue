<template>
  <div :class="$store.state.config.config.uiColor+0">
<!--  <div style="background-color: #fff8e7">-->
    <navi/>
    <router-view/>
    <notice/>
    <el-link href="https://github.com/AgMonk/open-nga" target="_blank">[GitHub]</el-link>
    <el-backtop :bottom="100">
      <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import Navi from "@/navi/navi";
import Notice from "@/views/notice";

export default {
  components: {Notice, Navi}
}
</script>