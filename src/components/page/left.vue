<template>
  <div>
    <el-menu style="height:100%"
              min-width="200px"
             class="el-menu-vertical-demo"
             text-color="#fff"
             background-color="#545c64"
             active-text-color="#ffd04b">
      <div v-for="(item, key) in menu"
           :key="key">
        <el-submenu :index="key"
                    v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item v-for="(list ,index) in item.children"
                        :key="index"
                        @click="changePage(list)"
                        :index="list.id">{{list.name}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="key"
                      v-else
                      @click="changePage(item)">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'left',
  data () {
    return {
      menu: null
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
  watch: {
    showTabs (val) {
      debugger
      this.showTabs = val
    }
  },
  mounted () {
    this.$axios.get('./static/json/menu.json')
      .then((res) => {
        this.menu = res.data
      })
  },
  methods: {
    changePage (item) {
      this.$router.push({ name: item.url })
      debugger
      this.tabList.push({
        name: item.name,
        url: item.url
      })
      this.$store.commit('setTabList', this.tabList)
      this.$store.commit('setShowTabs', item.url)
    }
  }
}
</script>
