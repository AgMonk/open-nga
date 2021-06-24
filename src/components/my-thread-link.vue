<template>
 <my-router-link :params="[tid,page?page:1]" :text="text" :url="undefined" link-style="color: blue" router="read" />
</template>

<script>
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "my-thread-link",
  components: {MyRouterLink},
  data() {
    return {
      myData: {}
    }
  },
  props: ["tid", "text","page"],

}

</script>

<style scoped>

</style>