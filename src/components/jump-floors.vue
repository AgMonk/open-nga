<!--跳转楼层-->
<template>
<span style="margin-left: 10px">
  <el-input v-model="destFloors" :placeholder="`楼层<=${total}`" size="mini" style="width:130px" type="number"
  @keypress.enter="jump"
  />
  <el-button size="mini" type="success" @click="jump">跳转</el-button>
</span>
</template>

<script>
export default {
  name: "jump-floors",
  data() {
    return {
      destFloors:undefined,
    }
  },
  methods: {
    jump(){
      if (this.destFloors>this.total){
        this.$message.error("目标楼层过高")
      }
      if (this.destFloors<0){
        this.$message.error("目标楼层不能为负")
      }
      let page = Math.floor(this.destFloors/20)+1

      this.$router.push(`/read/${this.tid}/${page}#L${this.destFloors}`)
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    tid:{
      type:Number,
      required: true
    },
    total:{
      type:Number,
      required: true
    },

  },
}

</script>

<style scoped>

</style>