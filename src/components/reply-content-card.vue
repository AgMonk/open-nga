<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header height="30px" style="padding: 0 10px">
      <el-row>
        <el-col :span="18" style="text-align: left">
          <el-tag v-clipboard:copy="myData.pid===0?'https://bbs.nga.cn/read.php?tid='+myData.tid:'https://bbs.nga.cn/read.php?pid='+myData.pid"
                  v-clipboard:error="onError"
                  v-clipboard:success="onCopy"
                  class="miniTag click-able"
                  size="mini"
                  @click.right="openUrl('https://bbs.nga.cn/read.php?pid='+myData.pid)"
          >#{{ myData.lou }}
          </el-tag>
          <el-tag class="miniTag" size="mini">
            <i class="el-icon-success click-able" @click="topicRecommend(myData.tid,myData.pid,1)"/>
            {{ myData.score }}
            <i class="el-icon-error click-able" @click="topicRecommend(myData.tid,myData.pid,-1)"/>
          </el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="$router.push(`/read/`+myData.pid)">{{ myData.postdate }}</el-tag>
          <el-tag v-if="myData.lastEdit" class="miniTag" size="mini">E:{{ myData.lastEdit }}</el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="readOnly">只看</el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="threadOnly(0)">本版主题</el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="threadOnly(1)">本版回复</el-tag>
          <el-tag v-if="myData.reply_to" class="miniTag click-able" size="mini" type="warning"
                  @click="$router.push(`/read/`+myData.reply_to)">回复目标
          </el-tag>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-switch v-model="showCode" active-color="#13ce66" active-text="显示源代码" inactive-color="#ff4949"></el-switch>
          <el-tag v-if="myData.authorid === parseInt($store.state.navi.params.account[0])"
                  class="miniTag click-able" size="mini" @click="reply(`modify`)"><i class="el-icon-chat-line-square"/>编辑
          </el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="reply(`quote`)"><i class="el-icon-chat-line-square"/>引用</el-tag>
          <el-tag class="miniTag click-able" size="mini" @click="reply(`reply`)"><i class="el-icon-chat-line-round"/>回复</el-tag>
        </el-col>

      </el-row>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 10px;text-align: left">
      <div v-show="showCode">
        {{ myData.content }}
      </div>
      <div v-show="!showCode">
        <content-parser :content="myData.content">{{ myData.content }}</content-parser>
      </div>
    </el-main>
    <el-footer style="padding: 0 10px">
      <div v-if="myData.operationLog">
        <el-tag v-for="(item,i) in myData.operationLog" :key="i" :type="item.type==='禁言'?'danger':'primary'">
          {{ item.type }}{{ item.type === '禁言' ? item.days + '天' : '' }} 声望{{ item.reputation }} 威望{{ item.rvrc }}
          {{ item.reason }}
        </el-tag>
      </div>
    </el-footer>
  </el-container>

</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {getRoute} from "@/assets/js/api/routerUtils";
import {topicRecommend} from "@/assets/js/api/api";
import ContentParser from "@/components/content-render";
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "reply-content-card",
  components: {MyRouterLink, ContentParser},
  data() {
    return {
      myData: {},
      showCode:false,
    }
  },
  methods: {
    reply(action) {
      this.$router.push(getRoute(["post", action, this.myData.fid, this.myData.tid, this.myData.pid, 0]))
    },
    openUrl(url) {
      window.open(url)
    },
    threadOnly(v) {
      this.$router.push(getRoute(["thread", this.myData.fid, 1, this.myData.authorid, v]))
    },
    topicRecommend(tid, pid, value) {
      topicRecommend(tid, pid, value).then(res => {
        this.$message.success(res.message)
        this.myData.score += res.value
      })
    },
    onCopy() {
      this.$message.success("已复制回复地址")
    },
    onError(e) {
      this.$message.error("复制失败")
      console.log(e)
    },
    readOnly() {
      let tid = this.$route.params.tid;
      let authorid = this.myData.authorid;
      this.$router.push(getRoute(["read", tid, 1, authorid]))
    },
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
      // console.log(JSON.stringify(parseBbsCode(this.myData.content)))

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
.miniTag {
  margin-left: 3px;
}

.click-able {
  cursor: pointer;
}
</style>