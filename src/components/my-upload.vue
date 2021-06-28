<template>
  <el-upload
      :action="attachUrl"
      :on-remove="onRemove"
      :before-upload="beforeUpload"
      :data="params"
      :file-list="fileList"
      :multiple="false"
      :name="prefix"
      :on-success="success"
      accept="image/*, .zip"
      list-type="picture"
      with-credentials
  >
    <el-button size="small" type="primary">点击上传</el-button>

  </el-upload>
</template>

<script>
import {encodeUTF8} from "@/assets/js/api/nga-request";

export default {
  name: "my-upload",
  data() {
    return {
      prefix: "attachment_file" + this.index,
      fileList:[],
      params: {
        func: "upload",
        v2: 1,
        origin_domain: "bbs.nga.cn",
        __output: 11,
        __inchst: "UTF8",
        auth: this.auth,
        fid: this.fid,

      }
    }
  },
  methods: {
    beforeUpload(file) {

      let regExp = /[\W_]/
      let name = file.name;
      for (let i = name.length -1; i >=0; i--) {
        let char = name[i];
        if (regExp.exec(char)){
          name = name.substring(0,i)
              +"%"+Number(encodeUTF8(char)).toString(16)
              +name.substring(i+1);
        }
      }

      let m = 1024 * 1024;
      console.log(file)
      this.params[this.prefix + `_dscp`] = ``;
      this.params[this.prefix + `_watermark`] = ``;
      this.params[this.prefix + `_img`] = 1;
      this.params[this.prefix + `_auto_size`] = file.size >= 4 * m ? 1:0;
      this.params[this.prefix + `_url_utf8_name`] = name;
    },
    success(response, file, fileList) {
      console.log(fileList)
      console.log(response)
      this.$emit("file-list-changed",fileList)
    },
    onRemove( file, fileList) {
      this.$emit("file-list-changed",fileList)
    },

  },
  mounted() {
  },
  watch: {
    "auth":{
      handler: function (e){
        this.params.auth = e;
      }
    },
    "fid":{
      handler: function (e){
        this.params.fid = e;
      }
    },

  },
  props: {
    auth: {  // 必须提供字段
      type: String,
      required: true
    },
    attachUrl: {  // 必须提供字段
      type: String,
      required: true
    },
    index: {
      required: true,
      type: Number,
    },
    fid: {
      required: true,
      type: Number,
    },
  }
}

</script>

<style scoped>

</style>