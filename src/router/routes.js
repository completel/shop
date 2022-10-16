/* 
    当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
*/

// 路由配置信息
export default [
    {
        path: '/home',
        component: () => import("@/pages/Home/Index"),
        meta: { show: true }
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        component: () => import("@/pages/Search"),
        // 路由组件能不能传递props数据？
        // 布尔值写法：params
        // props: true,
        // 对象写法:额外的给路由器组件传递一些props 
        // props: { a: 1, b: 2 },
        // 函数写法: 可以params参数，query参数，通过props传递给组件
        props: ($route) => {
            return { keyword: $route.params.keyword, k: $route.query.k }
        },
        meta: { show: true }
    },
    {
        path: '/login',
        component: () => import("@/pages/Login"),
        meta: { show: false }
    },
    {
        path: '/register',
        component: () => import("@/pages/Register"),
        meta: { show: false }
    },
    // 重定向，在项目跑起来的时候，访问/，立马让它定向到首页
    {
        path: '*',
        redirect: "/home",
    },
    {
        path: "/detail/:skuid?",
        component: () => import("@/pages/Detail"),
        meta: { isShow: true }
    },
    // 购物车添加成功组件
    {
        name: "addCartSuccess",
        path: "/addCartSuccess",
        component: () => import("@/pages/AddCartSuccess"),
        meta: { isShow: true }
    },
    // 购物车结算
    {
        path: '/shopcart',
        component: () => import("@/pages/ShopCart"),
        meta: { isShow: true }
    },
    {
        path: '/trade',
        component: () => import("@/pages/Trade"),
        meta: { isShow: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 去交易页面，必须是从购物车进去的
            if (from.path == '/shopcart') {
                next();
            } else {
                // next(false) 停留当前页|从哪来回哪去
                next(false);
            }
        }
    },
    {
        path: '/pay',
        component: import("@/pages/Pay"),
        meta: { isShow: true },
        beforeEnter: (to, form, next) => {
            if (form.path == '/trade') {
                next();
            } else {
                next(false);
            }
        }
    },
    {
        path: '/paySuccess',
        component: import("@/pages/PaySuccess"),
        meta: { isShow: true }
    },
    {
        path: '/center',
        component: () => import("@/pages/Center"),
        meta: { isShow: true },
        children: [
            {
                path: 'userorder',
                component: import("@/pages/Center/userOrder"),
            },
            {
                path: 'grouporder',
                component: import("@/pages/Center/groupOrder"),
            },
            {
                path: '/center',
                redirect: '/center/userorder',
            }
        ]
    }
]