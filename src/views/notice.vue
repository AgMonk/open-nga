<!--回复提醒-->

<template>
  <div>
    <el-button style="position: fixed; bottom: 0; left: 0;" @click="showDrawer=true">
      <i class="el-icon-message-solid"/>
      <i v-show="gotNew.replies || gotNew.pm||gotNew.approbation" class="el-icon-warning"/>
    </el-button>
    <el-drawer
        :before-close="handleClose"
        append-to-body
        v-model="showDrawer"
        size="60%"
        title="提示信息"
    >
      <el-collapse v-model="activeName" accordion @change="activeChanged" @click="clickInCol">
        <el-collapse-item name="replies">
          <template #title>
            <span style="margin-left: 30px">回复({{ replies.length }})
              <i v-show="gotNew.replies" class="el-icon-warning"/></span>
          </template>
          <div class="noticeOuterDiv">
            <div v-for="(item,i) in replies" :key="i" class="noticeItem">
              {{ item.timeString.substring(5) }}
              <user-link :id="item.authorId" :username="item.authorName"/>
              &nbsp;
              <my-reply-link :pid="item.replyPid" text="[回复]"/>
              了你
              <span v-if="item.repliedPid">在</span>
              <span v-if="!item.repliedPid">的</span>
              <my-thread-link :page="item.page" :text="item.threadSubject.substring(0,Math.min(item.threadSubject.length,20))"
                              :tid="item.tid"/>
              <span v-if="item.repliedPid">的</span>
              <my-reply-link v-if="item.repliedPid" :pid="item.repliedPid" text="[回复]"/>

            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="pm">
          <template #title>
            <span style="margin-left: 30px">短消息({{ pm.length }})
              <i v-show="gotNew.pm" class="el-icon-warning"/></span>
          </template>
          <div class="noticeOuterDiv">
            <div v-for="(item,i) in pm" :key="i" class="noticeItem">
              {{ item.timeString.substring(5) }}
              <user-link :id="item.authorId" :username="item.authorName"/>
              回复了 对话：{{ item.mid }}
              <!--           todo 私信界面  -->
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="approbation">
          <template #title>
            <span style="margin-left: 30px">赞踩({{ approbation.length }})
              <i v-show="gotNew.approbation" class="el-icon-warning"/></span>
          </template>
          <div class="noticeOuterDiv">
            <div v-for="(item,i) in approbation" :key="i" class="noticeItem">
              主题
              <my-thread-link :text="item.threadSubject.substring(0,Math.min(item.threadSubject.length,20))" :tid="item.tid"/>
              的
              <my-reply-link :pid="item.pid" text="[回复]"/>
              赞踩数更新了
              <el-button size="mini" tag="div" type="danger" @click="noHint(item.tid,item.pid)">不再提示</el-button>
            </div>
          </div>
        </el-collapse-item>

      </el-collapse>

      <el-button type="danger" @click="clearNotice">清空信息</el-button>
    </el-drawer>
  </div>
</template>

<script>
import {mapState} from "vuex";
import UserLink from "@/components/user-link";
import MyThreadLink from "@/components/my-thread-link";
import MyReplyLink from "@/components/my-reply-link";
import {noHint} from "@/assets/js/api/api";

export default {
  name: "notice",
  components: {MyReplyLink, MyThreadLink, UserLink},
  data() {
    return {
      activeName: 0,
      showDrawer: false,
      newMsg: {},
    }
  },
  computed: {
    ...mapState({
      approbation: state => state.notice.approbation,
      replies: state => state.notice.replies,
      pm: state => state.notice.pm,
      gotNew: state => state.notice.gotNew,
    })
  },
  methods: {
    handleClose(done) {
      this.activeName = 0;
      done();
    },
    clearNotice() {
      this.$store.dispatch("notice/clearNotice").then(() => {
        this.showDrawer = false;
      })
    },
    noHint(tid, pid) {
      noHint(tid, pid).then(res => {
        this.$message.success(res)
      })
    },
    activeChanged(e) {
      this.gotNew[e] = false;
    },
    clickInCol(e) {
      // console.log(e.path)

      if (["SPAN"].includes(e.path[0].nodeName) && ["SPAN"].includes(e.path[1].nodeName)) {
        this.showDrawer = false;
      }

    },
    getNotice() {
      this.$store.dispatch("notice/getNotice")
    },
  }
  ,
  mounted() {
    this.getNotice()
    setInterval(this.getNotice, 1000 * 60)
  }
}

</script>

<style scoped>
.noticeOuterDiv {
  height: 400px;
  overflow: scroll;
  text-align: left
}

.noticeItem {
  margin-left: 20px;
  margin-top: 2px
}
</style>