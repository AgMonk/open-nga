<template>
  <el-tag
      size="mini"
      style="margin-left: 3px;cursor:pointer"
      type="type?type:'primary'"
      @click="onClick"
  >
    {{ text }}
  </el-tag>
</template>

<script>
import {getRoute} from "@/assets/js/api/routerUtils";

export default {
  name: "my-mini-tag",
  methods:{
    onClick(e){
      if (this.route) {
        this.$router.push(getRoute(this.route))
      }
      this.$emit(`click`,e)
    }
  },
  props: ["text", "type","route"],
}

</script>

<style scoped>

</style>