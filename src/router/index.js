import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
// 按需加载各个组件
const Index = ()=>import('views/Index');
const Login = ()=>import('views/Login'); 
const Home = ()=>import('views/Home'); 
const Order = ()=>import('views/Order'); 
const Me = ()=>import('views/Me'); 
const Address = ()=>import('views/Address'); 
const City = ()=>import('views/City'); 


const routes = [
  {
    path: '/',
    // name: 'index',
    component: Index,
    children:[
      {
        // 重定向，使得进入'/'时直接去往/home
        path:'',
        redirect:'/home',
      },
      {
        path:'/home',
        name:'home',
        component: Home
      },
      {
        path:'/order',
        name:'order',
        component: Order
      },
      {
        path:'/me',
        name:'me',
        component: Me
      },
      {
        path:'/address',
        name:'address',
        component: Address
      },
      {
        path:'/city',
        name:'city',
        component: City
      }
    ]
  },
  {
   path:'/login',
   name:'login',
   component: Login 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 路由守卫
router.beforeEach((to,from,next)=>{
  const  isLogin = localStorage.ele_login ? true : false;
  if(to.path === '/login'){
    next();
  }else{
    // 是否在登录状态下
    isLogin ? next():next('/login');
  }
})
export default router
