<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item v-for="(item,i) in navi" :key="i" :index="''+i">{{item.title}}</el-menu-item>

  </el-menu>
</template>

<script>
import {getCookie} from "@/assets/js/cookieUtils";

export default {
  name: "navi",
  data() {
    return {
      activeIndex:"0",
      navi:[
        {path:"/account",params:this.uid,title:'用户中心'},
      ],
    }
  },
  methods:{
    handleSelect(e){
      let r = this.navi[e].path+"/"+this.navi[e].params;
      this.$router.push(r)
    }
  },
  mounted() {
    this.navi[this.navi.length-1].params = getCookie("ngaPassportUid")
  }
}

</script>

<style scoped>

</style>