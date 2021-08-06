<!--suppress HtmlUnknownAttribute -->
<template>
  <el-submenu v-if="route.title&&route.children" :index="path">
    <template #title>{{ route.title }}</template>
    <my-navigation-item v-for="(child,i) in route.children" :key="i" :parent-path="path" :route="child"/>
  </el-submenu>
  <el-menu-item v-else-if="route.title" :index="path">
    {{ route.title }}
  </el-menu-item>
</template>

<script>
export default {
  name: "my-navigation-item",
  data() {
    return {
      path: this.parentPath
    }
  },
  methods: {},
  mounted() {
    console.log(this.route)
    console.log(this.parentPath)
    let path = this.route.path;
    if (path && !path.startsWith(`/`)) {
      this.path += `/`
    }
    this.path += path;

  },
  props: {
    route: {
      required: true
    },
    parentPath: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>