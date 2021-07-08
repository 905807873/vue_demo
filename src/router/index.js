import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/index'
import index from '@/components/home/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'login'}
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {
          path: 'home',
          name: 'home', // 要跳转的路由名称 不是路径
          component: () => import('../components/page/home')
        },
        {
          path: 'introduction',
          name: 'introduction', // 要跳转的路由名称 不是路径
          component: () => import('../components/page/introduction')
        },
        {
          path: 'Arcgis',
          name: 'Arcgis', // 要跳转的路由名称 不是路径
          component: () => import('../components/page/Arcgis')
        },
        {
          path: 'OpenLayers',
          name: 'OpenLayers', // 要跳转的路由名称 不是路径
          component: () => import('../components/page/OpenLayers')
        },
        {
          path: 'setting',
          name: 'setting', // 要跳转的路由名称 不是路径
          component: () => import('../components/page/setting')
        }
      ]
    }
  ]
})
