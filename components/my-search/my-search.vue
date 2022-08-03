<template>
    <view>
        <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
            <!-- 使用 view 组件模拟 input 输入框的样式 -->
            <view class="my-search-box" :style="{'border-radius':bradius + 'px'}">
                <uni-icons type="search" size="17"></uni-icons>
                <text class="placeholder">搜索</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-search",
        props: {
            bgcolor: {
                type: String,
                default: '#c00000'
            },
            bradius: {
                type: Number,
                default: 15
            }

        },
        data() {
            return {

            };
        },
        methods: {
            //触发父组件的自定义函数 跳转到搜索页面
            searchBoxHandler() {
                this.$emit('pageSearch')
            }
        }
    }
</script>

<style lang="scss">
    .my-search-container {
        display: flex;
        height: 50px;
        // 通过props传递修改
        // background-color: #c00000;

        .my-search-box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 36px;
            // border-radius: 15px;
            background-color: #ffffff;

            .placeholder {
                padding: 0 5px;
            }
        }

    }
</style>
