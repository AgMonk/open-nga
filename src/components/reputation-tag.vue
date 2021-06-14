<template>
<el-tag :type="type" size="small">
  {{myData.name}} ({{ myData.value }})
</el-tag>
</template>

<script>
import {copyObj} from "@/assets/js/utils";

export default {
name: "reputation-tag",
  data() {
    return {
      myData:{},
      type:"",

    }
  },
  methods: {
    copy(obj){
      this.myData = obj?copyObj(obj):[];
      let v= this.myData.value;
      if (v >= 300) {
        this.type = `success`
      }else if (v>=0){
        this.type = `primary`
      }else if (v>=-300){
        this.type = `warning`
      }else{
        this.type = `danger`
      }
    }
  },
  mounted() {
    this.copy(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.copy(e)
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>

</style>