<template>
  <el-row>
    <el-col :span="data['topic_misc_var']?19:24">
      <my-router-link :link-class="$store.state.config.config.uiColor+index%2"
                      :link-style="threadColor(data.titlefont||data.topic_misc)"
                      :text="unEscape(data.subject)" :url="getUrl()"/>
      <my-mini-tag v-if="data.typeOfThread && data.typeOfThread.locked" text="锁定" type="danger"/>
      <my-mini-tag v-if="data.typeOfThread && data.typeOfThread.selfReply" text="自回复" type="danger"/>
      <my-mini-tag v-if="data.typeOfThread && data.typeOfThread.hidden" text="隐藏" type="danger"/>
      <my-mini-tag v-if="data.typeOfThread && data.typeOfThread.freeEdit"  text="编辑"/>

      <el-pagination v-if="data.replies>=20 && !data.__P"
                     :current-page="currentPage"
                     layout="pager"
                     :pager-count="5"
                     :total="data.replies+1"
                     :page-size="20"
                     @current-change="currentChange"
      />
      <div v-if="data.__P">
        <!--        指定用户回复-->
        <el-tag size="mini">
          <my-router-link :url="getRoute([`read`,data.__P.pid])" text="在主题中的回复"/>
        </el-tag>
        <datetime :data="data.__P.postdate"/>
        <br/>
        <br/>
        <div>
          <content-render :content="data.__P.content"/>
        </div>
      </div>
    </el-col>

    <el-col v-if="data.parent || data['topic_misc_var']" :span="(data.parent || data['topic_misc_var'])?5:0">
      <!--     版面镜像入口-->
      <el-tag v-if="data['topic_misc_var']&&data['topic_misc_var']['1']===32">版面镜像</el-tag>
      <!--      镜像版面主题标记-->
      <span v-if="data.parent&&data.parent['2']!==`版面镜像`">[{{ data.parent['2'] }}]</span>
      <!--      合集入口-->
      <el-tag v-if="data['topic_misc_var']&&data['topic_misc_var']['1']===33">版面合集</el-tag>
    </el-col>

  </el-row>
</template>

<script>
import {copyObj, unEscape} from "@/assets/js/utils";
import {titleStyle} from "@/assets/js/colorMap";
import {getRoute} from "@/assets/js/api/routerUtils";
import MyRouterLink from "@/components/my-router-link";
import Datetime from "@/components/datetime";
import ContentRender from "@/components/content-render";
import MyMiniTag from "@/components/my-mini-tag";

export default {
  name: "thread-link",
  components: {MyMiniTag, ContentRender, Datetime, MyRouterLink},
  data() {
    return {
      currentPage: 1,
      myData: {},
    }
  },
  methods: {
    getRoute,
    unEscape,
    currentChange(e) {
      this.$router.push(getRoute(["read", this.data.tid, e]))
    },
    threadColor: titleStyle,
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
    },
    getUrl() {
      let parent = this.data.parent;
      if (parent && parent["2"] === '版面镜像') {
        return getRoute(["thread", this.data["topic_misc_var"]["3"], 1])
      }
      let stid = this.data["topic_misc_var"]
      if (stid && stid["1"] === 33) {
        //  合集入口
        return getRoute(["thread", this.$route.params.fid, 1, this.data.tid])
      }
      if (this.data.quote_from > 0) {
        return getRoute(["read", this.data.quote_from, 1])
      }
      if (this.data.tid) {
        return getRoute(["read", this.data.tid, 1])
      }
      return ""
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
  props: ["data", "index"],
}

</script>

<style scoped>

</style>