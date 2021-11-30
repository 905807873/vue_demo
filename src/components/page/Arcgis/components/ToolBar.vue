<!--
 * @Descripttion: ToolBar
 * @Author: licheng
 * @Date: 2021-07-12 16:05:43
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 17:03:19
-->
<template>
  <div
    class="toolBar"
    @mouseenter="() => (openTable = true)"
    @mouseleave="() => (openTable = false)"
  >
    <div
      class="item"
      :class="[openTable ? 'show' : 'hide']"
      v-for="item in barList"
      :key="item.id"
      :style="{ color: activeIndex == item.id ? '#409EFF' : '#000' }"
      @click="handleClick(item)"
    >
      <i :class="item.icon"></i>
      <span v-show="openTable">{{ item.title }}</span>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
export default {
  name: 'ToolBar',
  data () {
    return {
      openTable: false,
      activeIndex: null, // 当前选中工具
      barList: [
        {
          title: '属性查询',
          id: 'Identify',
          icon: 'el-icon-warning-outline'
        }
      ]
    }
  },
  computed: {
    view () {
      return this.$store.state.view
    }
  },
  methods: {
    handleClick (item) {
      let _this = this
      if (this.activeIndex === item.id) {
        this.activeIndex = null
        utils.removeEventListener()
      } else {
        this.activeIndex = item.id
        switch (item.id) {
          case 'Identify':
            utils.Identify(function (results) {
              _this.$emit('attribute', results)
            })
            break
          default:
            break
        }
      }
    }
  },
  mounted () {},
  created () {}
}
</script>

<style lang="less" scoped>
.toolBar {
  display: inline-block;
  background-color: #fff;
  right: 30px;
  position: absolute;
  z-index: 1;
  top: 100px;
  border: 1px solid #789cad;
  border-radius: 8px;
  text-align: center;
  .show {
    width: 80px;
  }
  .hide {
    width: 30px;
  }
  .item {
    margin: 10px 0px;
    cursor: pointer;
    span {
      font-size: 12px;
    }
  }
}
</style>
