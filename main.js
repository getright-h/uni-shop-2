import App from './App'
//引入网络请求包
import {
    $http
} from '@escook/request-miniprogram'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

//配置基本url
$http.baseUrl = 'https://api-ugo-web.itheima.net'

//请求拦截器
$http.beforeRequest = function(options) {
    wx.showLoading('加载中....')
}

//响应拦截器 
$http.afterRequest = function(options) {
    wx.hideLoading()
}

//封装失败响应提示
uni.$showToast = function(title = '请求失败', duration = 1500) {
    uni.showToast({
        title,
        duration,
        icon: 'error'
    })
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
    createSSRApp
} from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif
