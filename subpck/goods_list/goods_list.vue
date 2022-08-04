<template>
    <view>
        <view class="goods-list">
            <view v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)">
                <my-goods :item='item'></my-goods>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        onLoad(options) {
            //获取路由跳转携带的参数
            this.queryObj.query = options.query || ''
            this.queryObj.cid = options.cid || ''
            //获取商品列表
            this.getGoodList()
        },
        onPullDownRefresh() {
            //下拉刷新，记得刷新完一定要手动关闭
            //重置参数
            this.queryObj.pagenum = 1
            this.total = 0
            this.goodsList = []
            this.isLoading = false
            //重新发送请求 携带一个函数，关闭下拉刷新
            this.getGoodList(() => uni.stopPullDownRefresh())

        },
        onReachBottom() {
            //触底上拉，加载更多
            //判断是否还有数据需要加载 (当前页码 * 页码条数 >= 总页面)
            if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg(
                '没有更多数据了')

            //节流阀 看是否有请求正在发送
            if (this.isLoading) return
            //页码加一
            this.queryObj.pagenum++
            //重新发送请求 
            this.getGoodList()
        },
        data() {
            return {
                //节流阀 防止触底加载时一直发送请求
                isLoading: false,
                //商品列表
                goodsList: [],
                //总页数 用来分页
                total: 0,
                //发起请求的参数
                queryObj: {
                    //查询关键字
                    query: '',
                    //查询id
                    cid: '',
                    //请求页码
                    pagenum: 1,
                    //显示几条
                    pagesize: 10
                }
            };
        },
        methods: {
            // 点击跳转到商品详情页面
            gotoDetail(item) {
                console.log(1);
                uni.navigateTo({
                    url: '/subpck/goods_detail/goods_detail?goods_id=' + item.goods_id
                })
            },
            //获取商品列表函数
            async getGoodList(cb) {
                //正在发送请求 打开节流阀
                this.isLoading = true
                const {
                    data
                } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
                if (data.meta.status !== 200) return uni.$showMsg()
                //判断是否传入关闭下拉刷新的函数
                //当数据请求完毕就立即调用
                cb && cb()

                //由于触底加载下一页，数据需要做个拼接
                // this.goodsList = data.message.goods
                this.goodsList = [...this.goodsList, ...data.message.goods]

                this.total = data.message.total
                //发送完请求 关闭节流阀
                this.isLoading = false

            },
        }
    }
</script>

<style lang="scss">

</style>
