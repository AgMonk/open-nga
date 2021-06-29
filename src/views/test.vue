<template>
  <el-upload
      id="el-upload-dragger"
      class="upload-demo"
      drag
      multiple>
    <template #trigger >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

    </template>
    <div></div>
  </el-upload>
</template>

<script>

export default {
  name: "test",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
  },

  mounted() {

  }
}

</script>

<style scoped>
</style>