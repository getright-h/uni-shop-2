import {
    mapMutations,
} from "vuex"

export default {
    data() {
        return {
            //倒计时
            countDown: 2,
            // 定时器
            timer: null
        }
    },
    methods: {

        ...mapMutations('m_cart', ['updataRedirectInfo']),
        // 倒计时提示函数
        countDownTips() {
            uni.showToast({
                title: '请登录,' + this.countDown + '秒后跳转到登录页',
                duration: 1000,
                mask: true,
                icon: "none"
            })
        },
        // 跳转倒计时函数
        switchCountDown() {
            this.countDown = 2
            this.countDownTips()

            this.timer = setInterval(() => {
                if (this.countDown <= 0) {
                    //达到指定时间后清空定时器，并跳转页面
                    clearInterval(this.timer)
                    // 跳转页面
                    uni.switchTab({
                        url: '/pages/my/my',
                        success: () => {
                            // 即将跳转，把跳转前的页面路径保存，方便登录后跳回来
                            this.updataRedirectInfo({
                                openType: 'switchTab',
                                from: '/pages/cart/cart'
                            })
                        }
                    })
                    // 终止后续显示提示框的代码
                    return
                }
                this.countDown--
                this.countDownTips()
            }, 1000)
        }
    },
}
