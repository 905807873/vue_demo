<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-10 10:24:44
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-19 15:10:02
-->
<template>
  <div class="content_page">
    <div class="tag-header">
      <el-tag
        v-for="tag in tabList"
        class="tag"
        :class="[showTabs === tag.url ? 'el-tag--dark' : '']"
        :key="tag.name"
        @click="changePage(tag)"
        @close="closePage(tag)"
        closable
      >
        {{ tag.name }}
      </el-tag>
    </div>
    <div class="router-view">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'centont',
  data () {
    return {
    }
  },
  computed: {
    tabList () {
      return this.$store.state.tabList
    },
    showTabs () {
      return this.$store.state.showTabs
    }
  },
  mounted () {

  },
  methods: {
    changePage (item) {
      this.$router.push({ name: item.url })
      this.$store.commit('setShowTabs', item.url)
    },
    closePage (item) {
      let index = this.tabList.findIndex(x => x.url === item.url)
      this.tabList.splice(index, 1)
      if (item.url === this.showTabs) {
        this.$store.commit('setShowTabs', this.tabList[0].url)
        this.$router.push({ name: this.tabList[0].url })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.router-view {
  height: 100%;
  border: 1px solid #e1e1e1;
  margin: 10px 10px 0px 10px;
  background-color: #ffffff;
}
.content_page {
  background-color: #ececec;
  height: 100%;
  width: 100%;
  .tag-header {
    border-bottom: 1px solid #e1e1e1;
    background-color: #ffffff;
  }
  .tag {
    cursor: pointer;
    margin: 9px 0px 9px 10px;
  }
}
</style>
