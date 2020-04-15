import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let Login = () => import('@/components/content/login');
let Home = () => import('@/views/home/Home')

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//利用路由导航守卫来判断页面权限
router.beforeEach(function (to, from, next) { //to代表将要去到的地址，from代表从哪个路径跳转而来，next时一个方法，代表放行也就是允许访问
  if (to.path === '/login') return next();
  const tokenr = window.sessionStorage.getItem('token');
  if (!tokenr) return next('/login');
  next();
})
export default router
