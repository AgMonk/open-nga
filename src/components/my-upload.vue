<template>
 <div>
   <el-upload
       ref="upload"
       :action="attachUrl"
       :before-upload="beforeUpload"
       :data="params"
       :file-list.sync="fileList"
       :name="prefix"
       :on-remove="onRemove"
       :on-success="success"
       accept="image/*, .zip"
       list-type="picture-card"
       multiple
       with-credentials
   >
     <template #default>
       <i class="el-icon-plus"></i>
     </template>
     <template #file="{file}">
       <div>
         <img :src="file.url" alt="" class="el-upload-list__item-thumbnail" />
         <span v-if="!file.status || file.status!==`success`" class="el-upload-list__item-actions">
            <span
                class="el-upload-list__item-preview"
            >
            <i class="el-icon-loading"></i>
          </span>
         </span>
         <span v-if="file.status&& file.status===`success`" class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
              class="el-upload-list__item-preview"
              @click="addFile(file)"
          >
            <i class="el-icon-plus"></i>
          </span>
          <span
              class="el-upload-list__item-delete"
              @click="$refs.upload.handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
       </div>
     </template>
   </el-upload>
     <el-dialog v-model="dialogVisible">
       <el-image :src="dialogImageUrl" />
     </el-dialog>
 </div>
</template>

<script>
import {encodeUTF8} from "@/assets/js/api/nga-request";

export default {
  name: "my-upload",
  data() {
    return {
      dialogVisible:false,
      dialogImageUrl:"",
      prefix: "attachment_file" + this.index,
      fileList:[],
      tempFileList:[],
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
    addFile(file){
      this.$emit("add-file",file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
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