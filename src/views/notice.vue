<!--回复提醒-->

<template>
 <div>

 </div>
</template>

<script>
import {getNotice} from "@/assets/js/api/api";

export default {
  name: "notice",
  data() {
    return {
      myData: {}
    }
  },
  mounted() {
    getNotice()
  }
}

</script>

<style scoped>

</style>