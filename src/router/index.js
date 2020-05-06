import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/components/content/login');
const Home = () => import('@/views/home/Home');
const UserList = () => import('@/views/userList/UserList')
const PowerList = () => import('@/views/power/PowerList')
const RoleList = () => import('@/views/power/RoleList')
const Good = () => import('@/views/goods/Cate')
const Categories = () => import('@/views/goods/Categories')
const CateParam = () => import('@/views/goods/CateParam')
const Add = () => import('@/views/goods/CateChild/AddProduct')
const Orders = () => import('@/views/orders/orderList')
const Report = () => import('@/views/report/Report')

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
    component: Home,
    redirect: "/users",
    children: [
      {
        path: '/users',
        component: UserList
      },
      {
        path: '/rights',
        component: PowerList
      },
      {
        path: '/roles',
        component: RoleList
      },
      {
        path: '/goods',
        component: Good,
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: CateParam
      },
      {
        path: '/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Report
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

//利用全局路由导航守卫来判断页面权限
router.beforeEach(function (to, from, next) { //to代表将要去到的地址，from代表从哪个路径跳转而来，next时一个方法，代表放行也就是允许访问
  if (to.path === '/login') return next();
  const tokenr = window.sessionStorage.getItem('token');
  if (!tokenr) return next('/login');
  next();
})
export default router
