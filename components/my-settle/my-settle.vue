<template>
    <view>
        <view class="settle-container">
            <label class="radio" @click="changeAllState">
                <radio color="#C00000" :checked="checkCount" /><text>全选</text>
            </label>
            <view class="amount-box">
                <text>合计：<text class="amount">
                        ￥{{checkAmount}}
                    </text></text>
            </view>
            <view class="btn-settle" @click="settlement">
                结算({{checkCount}})
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapGetters,
        mapMutations,
        mapState
    } from "vuex"
    import countDonwMixin from "@/mixins/countDown.js"
    export default {
        mixins: [countDonwMixin],
        name: "my-settle",
        /*        data() {
                    return {
                        //倒计时
                        countDown: 2,
                        // 定时器
                        timer: null
                    };
                }, */
        methods: {
            ...mapMutations('m_cart', ['changeAllCheckState']),
            // 更改商品全部状态
            changeAllState() {
                // 是否全选状态取反
                this.changeAllCheckState(!this.isFullCheck)
            },
            // 结算商品
            settlement() {
                // 是否勾选了商品
                if (!this.checkCount) return uni.$showMsg('未勾选商品')
                // 是否选择了收货地址
                if (!this.addstr) return uni.$showMsg('未选择收货地址')
                // 是否携带了token 即是否登录了 没有的话应该自动跳转到my页面
                if (!this.token) {
                    return this.switchCountDown()
                }
                //满足了上述所有条件 就可以实现微信支付功能
                this.payOrder()
            },
            // 微信支付
            async payOrder() {
                // 1. 创建订单
                // 1.1 组织订单的信息对象
                const orderInfo = {
                    // 开发期间，注释掉真实的订单价格，
                    // order_price: this.checkedGoodsAmount,
                    // 写死订单总价为 1 分钱
                    order_price: 0.01,
                    consignee_addr: this.addstr,
                    goods: this.cart.filter(x => x.goods_state).map(x => ({
                        goods_id: x.goods_id,
                        goods_number: x.goods_count,
                        goods_price: x.goods_price
                    }))
                }
                // 1.2 发起请求创建订单
                const {
                    data: res
                } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
                if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
                // 1.3 得到服务器响应的“订单编号”
                const orderNumber = res.message.order_number

                // 2. 订单预支付
                // 2.1 发起请求获取订单的支付信息
                const {
                    data: res2
                } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
                    order_number: orderNumber
                })
                // 2.2 预付订单生成失败
                if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
                // 2.3 得到订单支付相关的必要参数
                const payInfo = res2.message.pay

                // 3. 发起微信支付
                // 3.1 调用 uni.requestPayment() 发起微信支付
                const [err, succ] = await uni.requestPayment(payInfo)
                // 3.2 未完成支付
                if (err) return uni.$showMsg('订单未支付！')
                // 3.3 完成了支付，进一步查询支付的结果
                const {
                    data: res3
                } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
                    order_number: orderNumber
                })
                // 3.4 检测到订单未支付
                if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
                // 3.5 检测到订单支付完成
                uni.showToast({
                    title: '支付完成！',
                    icon: 'success'
                })
            }
        },
        computed: {
            ...mapGetters('m_cart', ['checkCount', 'total', 'checkAmount']),
            ...mapState('m_cart', ['cart']),
            ...mapGetters('m_user', ['addstr']),
            ...mapState('m_user', ['token']),
            // 是否全选
            isFullCheck() {
                return this.total === this.checkCount
            }
        }
    }
</script>

<style lang="scss">
    .settle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 100rpx;
        background: white;

        .radio {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 10rpx;
        }

        .amount {
            color: #c00000;
        }

        .btn-settle {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100rpx;
            min-width: 200rpx;
            background-color: #c00000;
            color: white;

        }
    }
</style>
