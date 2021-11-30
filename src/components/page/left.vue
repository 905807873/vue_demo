<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-10 10:24:44
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-18 15:53:55
-->
<template>
  <div>
    <el-menu
      style="height:100%"
      min-width="200px"
      class="el-menu-vertical-demo"
      text-color="#fff"
      background-color="#545c64"
      :default-active="activeIndex"
      active-text-color="#ffd04b"
    >
      <div v-for="(item, key) in menu" :key="key">
        <el-submenu :index="item.id" v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(list, index) in item.children"
            :key="index"
            @click="changePage(list)"
            :index="list.id"
            >{{ list.name }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.id" v-else @click="changePage(item)">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
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
      menu: null,
      activeIndex: '1',
      activeIndex2: '31'
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
      let obj
      this.menu.map(x => {
        if (x.children.length > 0 && x.children.filter(y => y.url === val)[0]) {
          obj = x.children.filter(y => y.url === val)[0]
        } else {
          if (x.url === val) obj = x
        }
      })
      this.activeIndex = obj.id
    }
  },
  mounted () {
    this.$axios.get('./static/json/menu.json').then(res => {
      this.menu = res.data
    })
  },
  methods: {
    changePage (item) {
      this.activeIndex = item.id
      this.$router.push({ name: item.url })
      if (this.tabList.filter(x => x.name === item.name).length === 0) {
        this.tabList.push({
          name: item.name,
          url: item.url
        })
        this.$store.commit('setTabList', this.tabList)
      }
      this.$store.commit('setShowTabs', item.url)
    }
  }
}
</script>
