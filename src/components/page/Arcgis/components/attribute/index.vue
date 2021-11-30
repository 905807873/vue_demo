<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-30 14:54:37
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 17:14:59
-->
<template>
  <div class="attributeTab" v-if="show">
    <div class="title">
      属性查询
      <i @click="close" class="close el-icon-close"></i>
    </div>
    <div class="content">
      <el-tabs tab-position="left" style="height: 500px;">
        <el-tab-pane
          v-for="item in featureList"
          :key="item.attributes.objectid || item.attributes.OBJECTID"
          :label="item.attributes[displayFieldName]"
        >
          <el-table
            :data="initAttr(item.attributes)"
            stripe
            height="400"
            style="margin: 20px"
          >
            <el-table-column prop="key" label="字段" width="130">
            </el-table-column>
            <el-table-column prop="value" label="值" width="130">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'attributeTab',
  data () {
    return {
      featureList: [],
      displayFieldName: '',
      show: false
    }
  },
  props: {
    attribute: {
      Type: Object
    }
  },
  watch: {
    attribute (val) {
      if (val.length === 0) {
        this.$message('未查询到数据')
        this.show = false
        return
      }
      this.featureList = []
      this.displayFieldName = val[0].displayFieldName
      val.forEach(x => {
        this.featureList.push(x.feature)
      })
      this.show = true
    }
  },
  methods: {
    initAttr (value) {
      let obj = []
      for (let i in value) {
        obj.push({ key: i, value: value[i] })
      }
      return obj
    },
    close () {
      this.show = false
    }
  },
  mounted () {},
  created () {}
}
</script>

<style lang="less" scoped>
.attributeTab {
  width: 400px;
  height: 500px;
  position: absolute;
  z-index: 1;
  background-color: #fff;
  border-radius: 0px 0px 15px 15px;
  top: 100px;
  right: 120px;
  .title {
    height: 50px;
    background-color: #409eff;
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    border-radius: 15px 15px 0px 0px;
  }
  .close {
    right: 10px;
    position: absolute;
    top: 13px;
    cursor: pointer;
  }
}
</style>
