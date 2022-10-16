import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api";
// 封装临时身份模块uuid--》生成一个随机的字符串
import { getUUID } from "@/utils/uuid_token"

const state = {
    goodsInfo: {},
    // 游客临时身份
    uuid_token: getUUID(),
};

const mutations = {
    GETGOODINFO(state, goodsInfo) {
        state.goodsInfo = goodsInfo;
    }
};

const actions = {
    // 获取产品信息的actions
    async getGoodsInfo({ commit }, skuid) {
        let result = await reqGoodsInfo(skuid);
        if (result.code == 200) {
            commit('GETGOODINFO', result.data);
        }
    },
    // 将产品添加到购物车当中
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 加入购物车返回的结构
        // 加入购物车以后（发请求），前台参数带给服务器
        // 服务器写入数据成功，并没有返会其它数据，只是返回code=200，代表操作成功
        // 因为服务器没有返回其余数据，因此咱们不需要三连环存储数据
        let result = await reqAddOrUpdateShopCart(skuId, skuNum);
        // 当前的这个函数如果执行返回Promise
        if (result.code == 200) {
            return "ok";
        } else {
            // 代表加入购物车失败
            return Promise.reject(new Error('faile'));
        }
    }
};

const getters = {
    // 路径导航简化的数据
    categoryView(state) {
        // 比如：state.goodsInfo初始状态空对象，空对象的categoryView的属性值是undefined
        // 当前计算出的 categoryView属性值至少是一个空对象，假的报错不会有了
        return state.goodsInfo.categoryView || {};
    },
    // 简化产品信息的数据
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {};
    },
    // 产品售卖属性的简化
    spuSaleAttrList(state) {
        return state.goodsInfo.spuSaleAttrList || [];
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}