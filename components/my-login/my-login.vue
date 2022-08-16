<template>
    <view class="login-container">
        <!-- 提示登录的图标 -->
        <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
        <!-- 登录按钮 -->
        <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
        <!-- 登录提示 -->
        <view class="tips-text">登录后尽享更多权益</view>
    </view>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from "vuex"
    export default {
        name: "my-login",
        data() {
            return {

            };
        },
        computed: {
            ...mapState('m_cart', ['redirectInfo'])
        },
        methods: {
            ...mapMutations('m_user', ['updataUserInfo', 'updataToken']),
            ...mapMutations('m_cart', ['updataRedirectInfo']),
            getUserProfile() {
                uni.getUserProfile({
                    desc: '获取用户登录信息，用于登录',
                    success: (res) => {
                        // 更新vuex中的用户信息
                        this.updataUserInfo(res.userInfo)
                        // 获取token函数
                        this.getUserToken(res)
                    },
                    fail: () => {
                        uni.$showMsg('您取消了登录授权')
                    }
                })
            },
            async getUserToken(info) {
                const [err, res] = await uni.login().catch(err => err)
                if (err || res.errMsg !== "login:ok") return uni.$showMsg('登录失败')
                // 准备参数对象
                const query = {
                    // 用户登录凭证
                    code: res.code,
                    encryptedData: info.encryptedData,
                    iv: info.iv,
                    rawData: info.rawData,
                    signature: info.signature
                }
                // 换取token
                // bug 本来应该获取此处返回信息中的token，但是由于后台没有开放权限，我们只能模拟一个假token
                const {
                    data
                } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
                // 是否成功
                if (!(data.meta.status === 200 || data.meta.status === 400)) return uni
                    .$showMsg('登录失败')
                // 如果返回值是400，表示请求是成功的(只是没权限返回token，这时就模拟一个假的)
                if (data.meta.status === 400) {
                    let fake_token =
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
                    // 把token保存
                    this.updataToken(fake_token)
                    // 回到之前强制跳转的页面
                    if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
                        uni.switchTab({
                            url: this.redirectInfo.from,
                            complete: () => {
                                // 清空跳转信息
                                this.updataRedirectInfo(null)

                            }
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .login-container {

        height: 750rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: #f8f8f8;
        position: relative;
        overflow: hidden;

        // 绘制登录盒子底部的半椭圆造型
        &::after {
            content: ' ';
            display: block;
            position: absolute;
            width: 100%;
            height: 40px;
            left: 0;
            bottom: 0;
            background-color: white;
            border-radius: 100%;
            transform: translateY(50%);
        }

        .btn-login {
            margin: 40rpx 0;
            width: 90%;
            border-radius: 200rpx;
            background: #c00000;
        }

        // 按钮下方提示消息的样式
        .tips-text {
            font-size: 24rpx;
            color: gray;
        }
    }
</style>
