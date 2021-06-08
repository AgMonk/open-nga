<template>
  {{ new Date(data * 1000).format("yyyy-MM-dd hh:mm:ss") }}
</template>

<script>
export default {
  name: "datetime",
  props: ["data"],
}

</script>

<style scoped>

</style>