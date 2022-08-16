<template>
    <view class="my-userinfo-container">

        <!-- 头像昵称区域 -->
        <view class="top-box">
            <image class="avatar" :src="userinfo.avatarUrl"></image>
            <view class="nickname">{{userinfo.nickName}}</view>
        </view>
        <!-- 信息区 -->
        <view class="my-info-box">
            <!-- row1 -->
            <view class="row">
                <view class="item-box">
                    <view class="item">
                        <text>8</text>
                        <text>收藏的店铺</text>
                    </view>
                    <view class="item">
                        <text>3</text>
                        <text>收藏的商品</text>
                    </view>
                    <view class="item">
                        <text>44</text>
                        <text>关注的商品</text>
                    </view>
                    <view class="item">
                        <text>213</text>
                        <text>足迹</text>
                    </view>
                </view>
            </view>

            <!-- row2 -->
            <view class="row">
                <view class="title">我的订单</view>
                <view class="item-box">
                    <view class="item">
                        <image src="/static/my-icons/icon1.png" class="icon"></image>
                        <text>待付款</text>
                    </view>
                    <view class="item">
                        <image src="/static/my-icons/icon2.png" class="icon"></image>
                        <text>待收货</text>
                    </view>
                    <view class="item">
                        <image src="/static/my-icons/icon3.png" class="icon"></image>
                        <text>退款/退货</text>
                    </view>
                    <view class="item">
                        <image src="/static/my-icons/icon4.png" class="icon"></image>
                        <text>全部订单</text>
                    </view>
                </view>
            </view>

            <!-- row3 -->
            <view class="row">
                <view class="panel-list-item">
                    <text>收货地址</text>
                    <uni-icons type="arrowright" size="15"></uni-icons>
                </view>
                <view class="panel-list-item">
                    <text>联系客服</text>
                    <uni-icons type="arrowright" size="15"></uni-icons>
                </view>
                <view class="panel-list-item" @click="logout">
                    <text>退出登录</text>
                    <uni-icons type="arrowright" size="15"></uni-icons>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from "vuex"
    export default {
        name: "my-userinfo",
        data() {
            return {

            };
        },
        computed: {
            ...mapState('m_user', ['userinfo'])
        },
        methods: {
            ...mapMutations('m_user', ['updateAddress', 'updataUserInfo', 'updataToken']),
            async logout() {
                const [err, succ] = await uni.showModal({
                    content: '是否确认退出',
                }).catch(err => err);
                if (succ.confirm) {
                    console.log(1);
                    // 清空本地数据
                    this.updataToken('')
                    this.updateAddress('')
                    this.updataUserInfo('')
                }
            }
        }
    }
</script>

<style lang="scss">
    .my-userinfo-container {
        height: 100%;
        background: #f4f4f4;
    }

    // 头像昵称区
    .top-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 400rpx;
        background: #c00000;

        .avatar {
            margin-bottom: 20rpx;
            width: 180rpx;
            height: 180rpx;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 1px 5px black;
        }

        .nickname {
            color: white;
            font-size: 48rpx;
        }
    }

    // 信息区
    .my-info-box {
        position: relative;
        top: -20rpx;

        .row {
            width: 95%;
            background-color: white;
            border-radius: 3px;
            margin: 0 auto;
            margin-bottom: 8px;

            .title {
                margin: 8px 0;

                line-height: 45px;
                padding-left: 10px;
                font-size: 15px;
                border-bottom: 1px solid #f4f4f4;
            }

            .panel-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 45px;
                padding-left: 10px;
                font-size: 15px
            }

            .item-box {
                display: flex;
                justify-content: space-around;
            }

            .item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 10px 0;
                font-size: 13px;

                .icon {
                    width: 35px;
                    height: 35px;
                }
            }
        }
    }
</style>
