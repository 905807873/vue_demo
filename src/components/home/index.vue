<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-10 10:24:44
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-17 15:07:35
-->
<template>
  <div class="home_page">
    <Left class="left"></Left>
    <div>
      <Header class="header"></Header>
      <Content class="content"></Content>
    </div>
  </div>
</template>

<script>
import Header from '../page/heardr'
import Left from '../page/left'
import Content from '../page/content'
export default {
  name: 'index',
  components: { Header, Left, Content },
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {},
  created () {
    this.$router.push({ name: 'home' })
  }
}
</script>

<style lang="less" scoped>
.home_page {
  height: 100%;
  width: 100%;
  .left {
    width: 13%;
    height: 100%;
    display: inline-block;
  }
  .content {
    position: fixed;
    top: 5%;
    width: 87%;
    right: 0px;
    height: 95%;
  }
  .header {
    width: 87%;
    height: 5%;
    text-align: center;
    border-bottom: 1px solid #edeff1;
    line-height: 50px;
    position: fixed;
    right: 0px;
    top: 0px;
    z-index: 1;
  }
}
</style>
