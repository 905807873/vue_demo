<!--
 * @Descripttion: ToolBar
 * @Author: licheng
 * @Date: 2021-07-12 16:05:43
 * @LastEditors: licheng
 * @LastEditTime: 2022-09-20 15:30:03
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
import utils from "@/utils";
import drawPoint from "@/utils/esri/Draw/drawPoint.js";
import drawLine from "@/utils/esri/Draw/drawLine.js";
import drawPoly from "@/utils/esri/Draw/drawPoly.js";

export default {
  name: "ToolBar",
  data() {
    return {
      openTable: false,
      activeIndex: null, // 当前选中工具
      barList: [
        {
          title: "属性查询",
          id: "Identify",
          icon: "el-icon-warning-outline"
        },
        {
          title: "地形开挖",
          id: "Slice",
          icon: "el-icon-ice-cream-square"
        },
        {
          title: "视域分析",
          id: "Viewable",
          icon: "el-icon-ice-cream-square"
        },
        {
          title: "地图绘制",
          id: "draw",
          icon: "el-icon-edit"
        },
        {
          title: "折线平滑",
          id: "bezierSpline",
          icon: "el-icon-magic-stick"
        },
        {
          title: "清除",
          id: "clear",
          icon: "el-icon-circle-close"
        }
      ]
    };
  },
  computed: {
    view() {
      return this.$store.state.view;
    }
  },
  methods: {
    handleClick(item) {
      let _this = this;
      if (this.activeIndex === item.id) {
        this.activeIndex = null;
        utils.removeEventListener();
      } else {
        this.activeIndex = item.id;
        switch (item.id) {
          case "Identify":
            utils.Identify(function(results) {
              _this.$emit("attribute", results);
            });
            break;
          case "draw":
            drawLine.Draw();
            break;
          case "bezierSpline":
            // 使用贝塞尔曲线算法，平滑折线
            drawLine.bezierSpline();
            break;
          case "Slice":
            drawPoly.Draw();
            break;
          case "Viewable":
            drawPoint.Draw();
            break;
          case "clear":
            this.view.graphics.removeAll();
            drawPoly.clear();
            this.view.map.findLayerById("mergeGraphicsLayer").removeAll();
            this.view.map.findLayerById("heightLayer").removeAll();
            break;
          default:
            break;
        }
      }
    }
  },
  mounted() {},
  created() {}
};
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
    span {
      width: 50px;
      display: inline-block;
    }
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
