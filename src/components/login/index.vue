<template>
  <div class="login_page">
    <div class="login_img"
         style="background: url('https://cdn.shidastudy.com/static/images/84/53/08/ed/22f13448eae3449c87b689ea4830dc70.png') no-repeat;">
    </div>
    <div class="login_from">
      <h1>师大教育APP管理后台</h1>
      <el-form :inline="true"
               :model="form"
               class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="用户名"
                    class="login_input"
                    v-model="form.username">
            <i slot="prefix"
               class="el-input__icon el-icon-user-solid"></i>
          </el-input>
          <el-input placeholder="密码"
                    class="login_input"
                    type="password"
                    v-model="form.password"
                    @keyup.enter.native="submit(form)">
            <i slot="prefix"
               class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="login_sub">
        <el-button style="width:400px;"
                   type="primary"
                   @click="submit(form)">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: 'LOGIN',
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submit (form) {
      console.log(form)
      if (form.username === 'admin' && form.password === 'admin') {
        this.$router.push({ path: '/home' })
      } else {
        alert('登陆失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_img {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 100% 100% !important;
}
.login_from {
  position: absolute;
  text-align: center;
  top: 300px;
  left: 750px;
  width: 400px;
  h1 {
    color: #fff;
    font-size: 38px;
  }
}
.login_input {
  margin-bottom: 20px;
}
.login_sub {
}
</style>
