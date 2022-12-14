// 配置路由的地方
import Vue from 'vue';
import VueRouter from 'vue-router';

// 引入路由配置信息
import routes from './routes';
// 引入store
import store from '@/store';

// 先把VueRouter原型对象的push，先保存一份
const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;

// 重写push|replace
// 第一个参数：告诉原来的push方法，你往哪里跳转(传递哪些参数)
// 第二个参数：成功的回调
// 第三个参数：失败的回调
// call||apply区别
// 相同点，都可以调用函数一次，都可以篡改函数的上下文一次
// 不同点：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
VueRouter.prototype.push = function (location, resolve, reject) {
    // console.log(location);
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (reject && resolve) {
        originReplace.call(this, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { });
    }

}

// 使用插件
Vue.use(VueRouter);

// 配置路由
const router = new VueRouter({
    // 配置路由
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 返回的这个y=0，代表的滚动条在最上方
        return { y: 0 }
    }
});

// 全局守卫：前置守卫（在路由跳转之前判断）
router.beforeEach(async (to, from, next) => {
    // to：可以获取到你要跳转到那个路由信息
    // from：可以获取到你从那个路由而来信息
    // next：放行函数   next()放行
    // next('/login');  放行到指定路由  next(false)
    // 用户登录了才有token，未登录一定不会有token
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    // 用户已经登录了
    if (token) {
        //已经登录而且还想去登录------不行
        if (to.path == "/login" || to.path == '/register') {
            next('/');
        } else {
            //已经登陆了,访问的是非登录与注册
            //登录了且拥有用户信息放行
            if (name) {
                next();
            } else {
                //登陆了且没有用户信息
                //在路由跳转之前获取用户信息且放行
                try {
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //token失效从新登录
                    await store.dispatch('userLogout');
                    next('/login')
                }
            }
        }
    } else {
        //未登录：不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
        //未登录去上面这些路由-----登录
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
            next('/login?redirect=' + toPath);
        } else {
            //去的不是上面这些路由（home|search|shopCart）---放行
            next();
        }

    }

});

export default router;

