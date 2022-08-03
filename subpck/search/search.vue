<template>
    <view class="">
        <!-- 搜索框 -->
        <view class="search-box">
            <uni-search-bar @input="input" :focus="true" :radius="100" cancelButton="none">
            </uni-search-bar>
        </view>
        <!-- 搜索建议 -->
        <view class="sug-list" v-if="searchResults.length !== 0">
            <view class="sug-item" v-for="(item,index) in searchResults" :key="index"
                @click="goDetail(item.goods_id)">
                <view class="item-name">
                    {{item.goods_name}}
                </view>
                <uni-icons type="arrowright" size="16"></uni-icons>
            </view>
        </view>
        <!-- 搜索历史 -->
        <view class="history-box" v-else>
            <!-- 标题区域 -->
            <view class="history-title">
                <text>搜索历史</text>
                <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
            </view>

            <!-- 记录项 -->
            <view class="h-list">
                <!-- 重排序后的渲染 -->
                <uni-tag :text="item" v-for="(item,index) in historyReverse" :key="index"
                    @click="gotoGoodsList(item)" inverted=true />

            </view>

        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                //防抖
                timer: null,
                //搜索词
                keyWord: '',
                //存放搜索结果
                searchResults: [],
                // 搜索历史列表
                historyList: []
            };
        },
        methods: {
            //跳转到对应商品列表
            gotoGoodsList(item) {
                uni.navigateTo({
                    url: '/subpck/goods_list/goods_list' + item
                })
            },
            //清除本地历史记录
            clearHistory() {
                // 清空 data 中保存的搜索历史
                this.historyList = []
                //清空storage中的
                uni.setStorageSync('keyWords', '[]')
            },
            //跳转到详情页
            goDetail(id) {
                uni.navigateTo({
                    url: '/subpck/goods_detail/goods_detail?goods_id=' + id
                })
            },
            //自定义搜索内容处理函数 e是输入的数据
            input(e) {
                //防抖
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.keyWord = e
                    //调用搜索函数
                    this.getSearchList(this.keyWord)
                }, 500);
            },
            //搜索函数
            async getSearchList(n) {
                //判断搜索词是否为空
                if (n === '') {
                    //重置搜索列表
                    this.searchResults = []
                    return
                }
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/qsearch', {
                    query: n
                })
                /* res.meta.status === 200 &&
                    return uni.$showMsg() */
                if (res.meta.status !== 200) return uni.$showMsg()
                this.searchResults = res.message

                //在查询到结构后，把搜索记录存放到data中
                this.saveSearchHistory(n)
            },
            //保存历史记录函数
            saveSearchHistory(n) {
                //这里如果直接push的话，结果会被放在列表的后面，我们希望放在最前面,使用要重排序
                this.historyList.push(n)
                // 数组去重
                let arr = new Set(this.historyList)
                this.historyList = [...arr]
                //把历史记录存储到本地
                uni.setStorageSync('keyWords', JSON.stringify(this.historyList))
            }
        },
        //计算属性 历史记录重排序
        computed: {
            //重排序后，页面渲染的数据就用 historyReverse替代就好了
            historyReverse() {
                return [...this.historyList].reverse()
            }
        },
        onLoad() {
            //加载时，把本地存储的搜索记录拿回来
            // 有就拿，没就给个空数组 
            this.historyList = JSON.parse(uni.getStorageSync('keyWords') || '[]')
        }
    }
</script>

<style lang="scss">
    // 吸顶
    .search-box {
        position: sticky;
        top: 0;
        z-index: 999;
    }

    //搜索建议
    .sug-list {
        display: flex;
        flex-direction: column;

        .sug-item {
            display: flex;
            height: 80rpx;
            line-height: 80rpx;
            font-size: 40rpx;
            padding: 23rpx 20rpx;

            .item-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    //搜索历史
    .history-box {
        padding: 0 5px;

        .history-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            font-size: 13px;
            border-bottom: 1px solid #efefef;
        }

        .h-list {
            display: flex;
            flex-wrap: wrap;

            uni-tag {
                margin-top: 5px;
                margin-right: 5px;
            }
        }
    }
</style>
