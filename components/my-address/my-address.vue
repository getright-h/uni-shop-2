<template>
    <view>
        <!-- 选择收货地址 -->
        <view class="address-choose-box" v-if="isShowAddress">
            <button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
        </view>
        <!-- 收货信息展示 -->
        <view class="address-info-box" v-else @click="chooseAddress">
            <view class="row1">
                <view class="row1-left">
                    <view class="username">收货人：<text>{{address.userName}}</text></view>
                </view>
                <view class="row1-right">
                    <view class="phone">电话：<text>{{address.telNumber}}</text></view>
                    <uni-icons type="arrowright" size="16"></uni-icons>
                </view>
            </view>
            <view class="row2">
                <view class="row2-left">收货地址：</view>
                <view class="row2-right">{{addstr}}</view>

            </view>
        </view>

        <!-- 底部分割线 -->
        <image src="/static/cart_border@2x.png" class="address-border"></image>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations,
        mapGetters
    } from "vuex"
    export default {
        name: "my-address",
        data() {
            return {};
        },
        methods: {
            ...mapMutations('m_user', ['updateAddress']),

            // 选择收货地址
            async chooseAddress() {
                // "requiredPrivateInfos": ["chooseAddress"],
                // 调用chooseAddress api返回promise对象
                const [err, succ] = await uni.chooseAddress().catch(err => err)
                // 用户成功选择了收货地址，就把地址保存
                if (err === null && succ.errMsg === 'chooseAddress:ok') {
                    this.updateAddress(succ)
                }
            }
        },
        computed: {
            ...mapState('m_user', ['address']),
            ...mapGetters('m_user', ['addstr']),

            // 控制收货地址的显示
            isShowAddress() {
                let foo = Object.keys(this.address).length
                return !foo
            }
        },

    }
</script>

<style lang="scss">
    // 选择地址盒子
    .address-choose-box {
        display: flex;
        height: 180rpx;
        justify-content: center;
        align-items: center;
    }

    // 地址信息盒子
    .address-info-box {
        display: flex;
        flex-direction: column;
        height: 180rpx;
        justify-content: center;
        font-size: 24rpx;
        padding: 0 10rpx;

        .row1 {
            display: flex;
            justify-content: space-between;

            .row1-right {
                display: flex;
                align-items: center;

                .phone {
                    margin-right: 5px;
                }
            }
        }

        .row2 {
            display: flex;
            align-items: center;
            margin-top: 20rpx;

            .row2-left {
                white-space: nowrap;
            }
        }
    }

    // 底部分割线
    .address-border {
        width: 100%;
        height: 10rpx;
    }
</style>
