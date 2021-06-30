<template>
  <div>
    <el-switch v-model="drag" active-color="#13ce66" active-text="拖拽" ></el-switch>
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
        :drag="drag"
        with-credentials
    >
      <template #default>
        <i class="el-icon-plus"></i>
      </template>
      <template #file="{file}">
        <div>
          <img :src="file.url" alt="" class="el-upload-list__item-thumbnail"/>
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
              @click="remove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
        </div>
      </template>
    </el-upload>
    <i style="font-size: 80%">选择文件 或 CTRL+V 粘贴截图</i>
    <el-dialog v-model="dialogVisible">
      <el-image :src="dialogImageUrl"/>
    </el-dialog>
  </div>
</template>

<script>
import {encodeUTF8} from "@/assets/js/api/nga-request";
import {copyObj} from "@/assets/js/utils";
import {parseImageName} from "@/assets/js/api/parseImageName";

export default {
  name: "my-upload",
  data() {
    return {
      drag:false,
      dialogVisible: false,
      dialogImageUrl: "",
      prefix: "attachment_file" + this.index,
      fileList: [],
      tempFileList: [],
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
    remove(file) {
      if (confirm("删除附件?")) {
        this.$refs.upload.handleRemove(file)
        this.$emit('del-attach', file.response.url)
      }
    },
    addFile(file) {
      let f = copyObj(file)
      let res={
        info:parseImageName(f.name),
        isImg:f.response.isImg,
        url:f.response.url,
      }
      this.$emit("add-file", res)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {

      // 把非数字、 字母的字符使用 UTF-8编码
      let regExp = /[\W_]/
      let name = file.name;
      for (let i = name.length - 1; i >= 0; i--) {
        let char = name[i];
        if (regExp.exec(char)) {
          name = name.substring(0, i)
              + "%" + Number(encodeUTF8(char)).toString(16)
              + name.substring(i + 1);
        }
      }

      let m = 1024 * 1024;
      console.log(file)
      // 尝试发现pixiv 或 推特图片
      let info = parseImageName(file.name);
      this.params[this.prefix + `_dscp`] = info?info.description:file.name;
      this.params[this.prefix + `_watermark`] = ``;
      this.params[this.prefix + `_img`] = 1;
      this.params[this.prefix + `_auto_size`] = file.size >= 4 * m ? 1 : 0;
      this.params[this.prefix + `_url_utf8_name`] = name;
    },
    success(response, file, fileList) {
      this.$emit("file-list-changed", fileList)
    },
    onRemove(file, fileList) {
      this.$emit("file-list-changed", fileList)
    },
    onPasteUpload(e) {
      const upload = this.$refs.upload
      if (!upload) {
        return
      }
      const items = e.clipboardData.items
      for (const item of items) {
        if (['image/png','image/jpg'].includes(item.type)) {
          const file = new File([item.getAsFile()], new Date().format("yyyy-MM-dd_hh_mm_ss") + '.png')
          upload.handleStart(file)
        }
      }
      upload.submit()
    },

  },
  mounted() {
    document.addEventListener('paste', this.onPasteUpload)
  },
  unmounted(){
    document.removeEventListener('paste', this.onPasteUpload)
  },
  watch: {
    "auth": {
      handler: function (e) {
        this.params.auth = e;
      }
    },
    "fid": {
      handler: function (e) {
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