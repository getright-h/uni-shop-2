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
            <view class="btn-settle">
                结算({{checkCount}})
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapGetters,
        mapMutations
    } from "vuex"
    export default {
        name: "my-settle",
        data() {
            return {

            };
        },
        methods: {
            ...mapMutations('m_cart', ['changeAllCheckState']),
            // 更改商品全部状态
            changeAllState() {
                // 是否全选状态取反
                this.changeAllCheckState(!this.isFullCheck)
            }
        },
        computed: {
            ...mapGetters('m_cart', ['checkCount', 'total', 'checkAmount']),
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
