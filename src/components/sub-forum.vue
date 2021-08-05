<template>
  <span style="margin-left: 10px">
    <el-tag>{{data.type}}</el-tag>
    <my-router-link v-if="data.type===`合集`" :params="[1,1,data.stid]" :text="data.name" router="thread" />
    <my-router-link v-if="data.type===`版面`"  :params="[data.fid,1]" :text="data.name" router="thread" />
  </span>
</template>

<script>
import MyMiniTag from "@/components/my-mini-tag";
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "sub-forum",
  components: {MyRouterLink, MyMiniTag},
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data:{required:true}
  },
}

</script>

<style scoped>

</style>