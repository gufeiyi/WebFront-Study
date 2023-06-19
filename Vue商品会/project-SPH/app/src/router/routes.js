// 路由配置的信息

// 配置路由
// import Home from '@/pages/Home'
// import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 引入二级路由
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

// 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载
// 如果我们能把不同路由对应的组件分割成不同的代码块
// 然后当路由被访问的时候才加载对应的组件，这样就会更加高效

// 路由懒加载
const Home = ()=>{
    // 只有Home路由被访问的时候才会加载
    console.log('首页被加载了');
    
    return import("@/pages/Home");
}
export default [
    {
        path:'/home',
        component:Home,
        meta:{showFooter:true}
    },
    {
        path:'/login',
        // 路由懒加载简写形式
        component:()=>import('@/pages/Login')
    },
    {
        path:'/register',
        component:Register
    },
    {
        name:'search',
        path:'/search/:keyword?',
        component:Search,
        meta:{showFooter:true}
    },
    {
        path:'/detail/:skuid?',
        component:Detail,
        meta:{showFooter:true}
    },
    {
        name:'addcartsuccess',
        path:'/addcartsuccess',
        component:AddCartSuccess,
        meta:{showFooter:true}
    },
    {
        path:'/shopcart',
        component:ShopCart,
        meta:{showFooter:true}
    },
    {
        path:'/trade',
        component:Trade,
        meta:{showFooter:true},
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 去交易页面，必须是由购物车而来
            if (from.path == '/shopcart') {
                next();
            } else {
                // 其他路由组件，停留在from页面
                next(false);
            }
        }
    },
    {
        path:'/pay',
        component:Pay,
        meta:{showFooter:true},
        beforeEnter: (to, from, next) => {
            // 只有从交易页面跳过来可以，其他页面不可以
            if (from.path == '/trade') {
                next();
            } else {
                next(false);
            }
        }
    },
    {
        path:'/paysuccess',
        component:PaySuccess,
        meta:{showFooter:true}
    },
    {
        path:'/center',
        component:Center,
        meta:{showFooter:true},
        // 二级路由组件
        children: [
            {
                path: 'myorder',
                component: MyOrder,
            },
            {
                path: 'groupOrder',
                component: GroupOrder,
            },
            // 重定向，默认显示我的订单组件
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },

    // 重定向，项目跑起来的时候，定向到首页
    {
        path:'*',
        redirect:'/home'
    }
]