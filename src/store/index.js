/*
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-07-12 16:05:43
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 11:06:44
 */
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
    showTabs: 'home', // 当前打开tabs
    view: null, // arcgis view对象
    ESRI: []// ESRI模块
  },
  mutations: {
    setTabList (state, items) {
      state.tabList = items
    },
    setShowTabs (state, items) {
      state.showTabs = items
    },
    setView (state, val) {
      state.view = val
    },
    setEsri (state, val) {
      state.ESRI = val
    }
  }
})

export default store
