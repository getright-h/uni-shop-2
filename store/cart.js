// 购物车模块的命名空间
export default {
    //开启命名空间
    namespaced: true,
    //  () => ({}) 返回一个对象表达式
    state: () => ({

        // 购物车的数组，用来存储购物车中每个商品的信息对象
        // 每个商品的信息对象，都包含如下 6 个属性：
        // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
        // 获取本地的购物车信息
        cart: JSON.parse(uni.getStorageSync('cart') || '[]')

    }),
    mutations: {
        //添加商品到购物车
        addToCart(state, goods) {
            // 判断购物车中是否已经存在了该商品
            // 数组方法find函数接受一个函数参数，会遍历数组中的每一项，返回符合函数参数条件的那一个数组元素，并停止循环，没有符合的就返回undefinde
            const currentGoods = state.cart.find((x) => x.goods_id === goods.goods_id)
            // true 即存在 使currentGoods对应的已经储存在vuex中的拿一项，数量加一就可
            if (currentGoods) {
                currentGoods.goods_count++
            } else {
                // undefinde 即不存在，就添加该商品的信息到vuex中
                state.cart.push(goods)
            }
            // 通过commit，调用命名空间下的saveCartStorage方法
            this.commit('m_cart/saveCartStorage')
        },
        // 把购物车信息存储到本地
        saveCartStorage(state) {
            uni.setStorageSync('cart', JSON.stringify(state.cart))
        },
        // 修改购物车勾取状态
        changeCartState(state, goods) {
            // 找到当前购物车中点击的商品
            const findRes = state.cart.find(i => {
                return i.goods_id === goods.goods_id
            })
            if (findRes) {
                // 修改对应商品的状态
                findRes.goods_state = goods.goods_state
                // 更新storage中的数据
                this.commit('m_cart/saveCartStorage')
            }
        },
        // 修改购物车商品数量
        changeCartCount(state, goods) {
            const findRes = state.cart.find(i => {
                return i.goods_id === goods.goods_id
            })
            if (findRes) {
                // 修改对应商品数量
                findRes.goods_count = goods.goods_count
                // 更新storage中的数据
                this.commit('m_cart/saveCartStorage')
            }
        },
        // 删除商品
        deletGoodsById(state, goods) {
            // 排除对应id的商品，过滤后重组原数组
            state.cart = state.cart.filter(i => {
                return i.goods_id !== goods.goods_id
            })
            this.commit('m_cart/saveCartStorage')
        },
        // 更改商品全选状态
        changeAllCheckState(state, newState) {
            state.cart.forEach(i => i.goods_state = newState)
            this.commit('m_cart/saveCartStorage')
        }
    },
    getters: {
        //获取购物车中商品的总量
        total(state) {
            let count = 0
            state.cart.forEach(i => count += i.goods_count)
            return count
        },
        // 勾选商品总数 保留小数两位
        checkCount(state) {
            return state.cart.filter(i => {
                return i.goods_state
            }).reduce((totle, curr) => {
                return totle += curr.goods_count
            }, 0).toFixed(2)
        },
        // 勾选商品总价
        checkAmount(state) {
            return state.cart.filter(i => i.goods_state).reduce((amount, curr) => {
                return amount += curr
                    .goods_count * curr.goods_price
            }, 0)
        }
    }
}
