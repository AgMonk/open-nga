<template>
 <my-router-link :params="[pid]" :text="text" :url="undefined" link-style="color: red" router="read" />
</template>

<script>
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "my-reply-link",
  components: {MyRouterLink},
  data() {
    return {
      myData: {}
    }
  },
  props: ["pid", "text"],

}

</script>

<style scoped>

</style>