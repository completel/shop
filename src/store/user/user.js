import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from "@/api";
import { setToken, getToken, removeToken } from '@/utils/token'

// 登录与注册
const state = {
    code: '',
    token: getToken(),
    userInfo: {},
};

const mutations = {
    GETCODE(state, code) {
        state.code = code;
    },
    USERLOGIN(state, token) {
        state.token = token;
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    // 清除本低数据
    CLEAR(state) {
        // 把仓库中无关的用户信息清空
        state.code = '';
        state.userInfo = {};
        // 本低存储数据清空
        removeToken();
    }
};

const actions = {
    // 获取验证码的这个接口：把验证码返回，但是正常情况下，后台把验证码发到用户手机上【省钱】
    async getCode({ commit }, phone) {
        const result = await reqGetCode(phone);
        if (result.code === 200) {
            commit('GETCODE', result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 注册用户
    async userRegister({ commit }, user) {
        const result = await reqUserRegister(user);
        if (result.code === 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 登录业务【token】
    async userLogin({ commit }, user) {
        const result = await reqUserLogin(user);
        // 服务器下发token，用户唯一标识符（uuid）
        // 将来经常通过带token找服务器要用户信息进行展示
        if (result.code === 200) {
            commit('USERLOGIN', result.data.token);
            setToken(result.data.token);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 获取用户信息
    async getUserInfo({ commit }) {
        const result = await reqUserInfo();
        if (result.code === 200) {
            commit('GETUSERINFO', result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 退出登录
    async userLogout({ commit }) {
        // 只是向服务器发起请求，通知服务器清除token
        const result = await reqLogout();
        // action里面不能操作state，所以要提交到mutations
        if (result.code === 200) {
            commit('CLEAR');
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
};
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters,
}