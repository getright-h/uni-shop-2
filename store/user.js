export default {
    namespaced: true,
    state: () => ({
        // 收货地址
        address: JSON.parse(uni.getStorageSync('address') || '{}')
    }),
    mutations: {
        // 更新收货地址
        updateAddress(state, address) {
            state.address = address
            this.commit('m_user/saveAddress')
        },
        //存储到本地
        saveAddress(state) {
            uni.setStorageSync('address', JSON.stringify(state.address))
        }
    },
    getters: {
        // 拼接收货人地址
        addstr(state) {
            // 判断是否为空
            if (!state.address.provinceName) return ''
            // 拼接 省，市，区，详细地址 的字符串并返回给用户
            return state.address.provinceName + state.address.cityName + state.address
                .countyName +
                state.address.detailInfo
        }
    }
}
