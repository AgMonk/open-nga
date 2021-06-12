<template>
  <router-link :to="url?url:getUrl()" style="text-decoration: none">
    <el-link :href="url?url:getUrl()" :style="linkStyle">
      <span :style="textStyle">{{ text }}</span>
    </el-link>
  </router-link>
</template>

<script>
export default {
  name: "my-router-link",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
    getUrl(){
      if(this.router) {
        return "/" + [this.router, ...this.params].join("/")
      }
      return "";
    }
  },
  mounted() {
  },
  props: ["router", "params", "text","url","linkStyle","textStyle"],
}

</script>

<style scoped>

</style>