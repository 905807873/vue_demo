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
  methods: {
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
    background-color: #5e92ce;
    line-height: 50px;
    position: fixed;
    right: 0px;
    top: 0px;
  }
}
</style>
