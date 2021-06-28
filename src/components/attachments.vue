<!-- 附件显示-->
<template>
  <div v-if="data && data.length>0">
    <!--    图片-->
    <h4 style="margin: 10px auto">已有附件</h4>
    <template  v-if="imgList&&imgList.length>0" >
      <el-row>
        <el-col v-for="(img,i) in imgList" :key="i" :lg="2" :md="3" :sm="4" :xs="6">
          <el-row >
                <el-col :span="12"><el-button size="mini" type="primary" @click="$emit(`add-file`,{isImg:true,url:img.attachUrl})"><i class="el-icon-plus"/></el-button></el-col>
                <el-col :span="12"><el-button size="mini" type="danger"><i class="el-icon-delete"/></el-button></el-col>
          </el-row>
          <el-image
              :hide-on-click-modal="true"
              :preview-src-list="img.srcList"
              :src="img.url"
              style="width: 100px; height: 100px">
          </el-image>
        </el-col>
      </el-row>

    </template>
  </div>
</template>

<script>

export default {
  name: "attachments",
  data() {
    return {
      prefix: "https://images.weserv.nl/?url=img.nga.178.com/attachments/",
      imgList: [],
      fileList: [],
    }
  },
  methods: {},
  mounted() {

  },
  watch: {
    "data": {
      handler: function (e) {
        this.imgList = [];
        let images = e.filter(item => item.type === 'img')
        images.forEach(img => {
          let url = this.prefix + img.attachurl;
          this.imgList.push({
            url,
            srcList: [url],
            attachUrl:img.attachurl,
          })
        })

        /* todo 非图片附件 */

        console.log(this.imgList)
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>

</style>