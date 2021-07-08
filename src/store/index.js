import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isShowLoading: false, // 全局 loading
    tabList: [{
      name: '首页',
      url: 'home'
    }], // 首页tab页
    showTabs: 'home' // 当前打开tabs
  },
  mutations: {
    setTabList (state, items) {
      state.tabList = items
    },
    setShowTabs (state, items) {
      state.showTabs = items
    }
  }
})

export default store
