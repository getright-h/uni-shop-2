<template>
    <view class="cart-container" v-if="isEmpty">
        <!-- 收货地址区 -->
        <my-address></my-address>
        <!-- 标题区 -->
        <view class="title">
            <!-- 左侧的图标 -->
            <uni-icons type="shop" size="18"></uni-icons>
            <!-- 描述文本 -->
            <text class="cart-title-text">购物车</text>
        </view>
        <!-- 商品信息 -->
        <uni-swipe-action>
            <block v-for="(item,index) in cart" :key='index'>
                <uni-swipe-action-item :right-options="options"
                    @click="swipeActionClickHandler(item)">
                    <my-goods :item="item" :isShowRadio='true' :isShowNumber="true"
                        @number-change="numberHandeler" @radio-change="radioHandler"></my-goods>
                </uni-swipe-action-item>
            </block>
        </uni-swipe-action>
        <!-- 结算区 -->
        <my-settle></my-settle>
    </view>
    <!-- 空白区 -->
    <view class="empty-box" v-else>
        <image src="/static/cart_empty@2x.png" class="empty-img"></image>
        <text class="tip-text">空空如也~</text>
    </view>
</template>

<script>
    import badgeMix from '@/mixins/tabbar-badge.js'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        mixins: [badgeMix],
        data() {
            return {
                options: [{
                    text: '删除', // 显示的文本内容
                    style: {
                        backgroundColor: '#C00000' // 按钮的背景颜色
                    }
                }]
            }
        },
        computed: {
            ...mapState('m_cart', ['cart']),
            // 购物车是否为空
            isEmpty() {
                return this.cart.length !== 0
            }
        },
        methods: {
            ...mapMutations('m_cart', ['changeCartState', 'changeCartCount', 'deletGoodsById']),
            // 删除对应商品函数
            swipeActionClickHandler(item) {
                this.deletGoodsById(item)
            },
            // 处理勾选框状态函数
            radioHandler(e) {
                this.changeCartState(e)
            },
            // 处理商品数量函数
            numberHandeler(e) {
                this.changeCartCount(e)
            }
        }
    }
</script>

<style lang="scss">
    .empty-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-size: 28rpx;

        .empty-img {
            height: 180rpx;
            width: 180rpx;
            margin-bottom: 20rpx;
        }

        .tip-text {
            display: block;
            color: gray;
        }
    }


    .cart-container {
        padding-bottom: 100rpx;
    }

    .title {
        display: flex;
        align-items: center;
        height: 80rpx;
        font-size: 28rpx;
        padding-left: 10rpx;
        border-bottom: 2rpx solid #efefef;

        .cart-title-text {
            margin-left: 20rpx;
        }
    }
</style>
