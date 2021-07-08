<template>
  <div class="content_page">
    <el-tabs v-model="showTabs"
             type="card"
             closable
             @tab-remove="handleTabsEdit">
      <el-tab-pane :key="item.name"
                   v-for="(item) in tabList"
                   :label="item.name"
                   :name="item.url">
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
    <div>
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
    goto () {
      this.$router.push('test')
    }
  }
}
</script>

<style lang="less" scoped>
.content_page {

}
</style>
