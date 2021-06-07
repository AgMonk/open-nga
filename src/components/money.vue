<template>
{{gold}}金 {{silver}}银 {{copper}}铜
</template>

<script>
export default {
  name: "money",
  data() {
    return {
      gold: 0,
      silver: 0,
      copper: 0,
    }
  },
  methods: {
    split(count) {
      let d = count;
      if (d) {
        this.copper = d % 100;
        d = (d - this.copper) / 100;
        this.silver = d % 100;
        d = (d - this.silver) / 100;
        this.gold = d;
      }
    }
  },
  mounted() {
    this.split(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.split(e)
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>

</style>