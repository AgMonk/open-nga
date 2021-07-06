<!--正文弹出框-->
<template>
  <el-popover
      :width="200"
      placement="bottom"
      trigger="hover"
  >
    <template #reference>
      <el-button size="mini" type="primary"><i class="el-icon-s-tools"/></el-button>
    </template>
    <template #default>
      <div>
        <h4>查看</h4>
        <my-mini-tag :route="[`read`, myData.tid, 1, myData. authorid]" text="只看TA"/>
        <my-mini-tag :route="[`thread`, myData.fid, 1, myData.authorid, 0]" text="本版主题"/>
        <my-mini-tag :route="[`thread`, myData.fid, 1, myData.authorid, 1]" text="本版回复"/>
      </div>

      <div>
        <h4>操作</h4>
        <my-mini-tag :route="[`post`,`quote`, myData.fid, myData.tid,myData.pid, 0]" text="引用"/>
        <my-mini-tag :route="[`post`,`reply`, myData.fid, myData.tid,myData.pid, 0]" text="回复"/>
        <my-mini-tag v-if="``+myData.authorid===getCookie(`ngaPassportUid`)"
                     :route="[`post`,`modify`, myData.fid, myData.tid,myData.pid, 0]" text="编辑"/>
        <my-mini-tag text="举报" @click="report.visible=true"/>


      </div>
      <div>
        <slot/>
        <el-dialog v-model="report.visible" append-to-body title="举报" @opened="$refs.reportInput.focus()">
          <el-form>
            <el-form-item>
              <el-input ref="reportInput" v-model="report.info" placeholder="举报理由"/>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="doReport">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </template>
  </el-popover>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import MyMiniTag from "@/components/my-mini-tag";
import {getCookie} from "@/assets/js/cookieUtils";
import {report} from "@/assets/js/api/api";

export default {
  name: "content-popover",
  components: {MyMiniTag},
  data() {
    return {
      report: {
        visible: false,
        info: "",
      },
      myData: {}
    }
  },
  methods: {
    getCookie,
    doReport() {
      report(this.myData.tid, this.myData.pid, this.report.info).then(res => {
        if (res.data) {
          this.$message.success(res.data["0"])
        }
        this.report.visible = false
      }).catch(()=>{
        this.report.visible = false
      })
    },
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
    }
  },
  mounted() {
    this.copy(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.copy(e)
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>
h4 {
  margin: 10px auto;
}
</style>