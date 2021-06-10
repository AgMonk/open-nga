<template>
  <el-card class="box-card">
    <template #header>
      <user-link :id="myData.uid" :username="myData.username" />
    </template>
    <div v-for="o in 4" :key="o" class="text item">
      {{'列表内容 ' + o }}
    </div>
  </el-card>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import UserLink from "@/components/user-link";

export default {
  name: "reply-user-card",
  components: {UserLink},
  data() {
    return {
      myData: {}
    }
  },
  methods: {
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
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