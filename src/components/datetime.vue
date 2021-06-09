<template>

  <span>
    <span v-if="minute<1" style="background-color: #94f5c9">{{ second }}秒前</span>
    <span v-if="minute>=1&&hour<1" style="background-color: #94f5c9">{{ minute }}分前</span>
    <span v-if="hour>=1&&day<1" style="background-color: #f7f971">{{ hour }}小时前</span>
    <span v-if="day>=1&&month<1" style="background-color: #f7b148">{{ day }}天前</span>
    <span v-if="month>=1" style="background-color: #f39df9">{{ datetime }}</span>
  </span>
</template>

<script>
export default {
  name: "datetime",
  data() {
    return {
      second: 0,
      minute: 0,
      hour: 0,
      day: 0,
      month: 0,
      datetime: "",
    }
  },
  methods:{
    update(){
      this.second = Math.floor(new Date().getTime() / 1000) - this.data;
      this.minute = (this.second / 60).toFixed(1)
      this.hour = (this.second / 60 / 60).toFixed(1)
      this.day = (this.second / 60 / 60 / 24).toFixed(1)
      this.month = (this.second / 60 / 60 / 24 / 30).toFixed(1)
      this.datetime = new Date(this.data * 1000).format("yyyy-MM-dd hh:mm:ss")
    }
  },
  mounted() {
    this.update();
  },
  watch:{
    "data":{
      handler:function(e){
        this.update()
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>

</style>