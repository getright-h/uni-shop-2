<template>
    <view class="goods-item">
        <!-- 用于购物车页面的勾选框 -->
        <view class="cart-radio" v-if="isShowRadio">
            <radio :checked='item.goods_state' color="#C00000" @click="radioClickHandler"></radio>
        </view>
        <!-- 左侧图片 -->
        <view class="left-box">
            <img :src="item.goods_small_logo || defaultPic " class="goods-pic" alt="">
        </view>
        <!-- 右侧文字 -->
        <view class="right-box">
            <view class="goods-name">
                {{item.goods_name}}
            </view>
            <view class="goods-info">
                <view class="goods-price">
                    ￥{{item.goods_price | tofixed}}
                </view>
                <!-- 用于购物车页面的商品数量 -->
                <uni-number-box :min="1" :value="item.goods_count" v-if="isShowNumber"
                    @change="numberChangeHandler">
                </uni-number-box>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-goods",
        props: {
            // 商品信息
            item: {
                type: Object,
                default: {}
            },
            // 是否展示购物车勾选框
            isShowRadio: {
                type: Boolean,
                default: false
            },
            // 是否展示购物车商品数量
            isShowNumber: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            radioClickHandler() {
                // 点击勾选框，发送当前商品的id，取反后的状态给父组件的自定义事件
                this.$emit('radio-change', {
                    goods_id: this.item.goods_id,
                    goods_state: !this.item.goods_state
                })
            },
            numberChangeHandler(val) {
                // 数值框发生变化，发送当前商品的id，新的数值给父组件的自定义事件
                // 预处理：整数化
                let value = parseInt(val)
                if (!value) {
                    // 若用户输入的值为NaN，则转换为1
                    value = 1
                }
                this.$emit('number-change', {
                    goods_id: this.item.goods_id,
                    // 加号用于转换为数值
                    goods_count: +value
                })
            },
        },
        filters: {
            // 把数字处理为带两位小数点的数字
            tofixed(num) {
                return Number(num).toFixed(2)
            }
        },
        data() {
            return {
                //默认图片
                defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
            };
        }
    }
</script>

<style lang="scss">
    .goods-item {
        // 让 goods-item 项占满整个屏幕的宽度
        // width: 750rpx;
        // 设置盒模型为 border-box
        // box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20rpx;
        border-bottom: 1px solid #f0f0f0;

        .goods-pic {
            width: 200rpx;
            height: 200rpx;
        }

        .right-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            margin-left: 20rpx;

            .goods-name {
                font-size: 28rpx;
            }

            .goods-info {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .goods-price {
                    font-size: 36rpx;
                    color: darkred;
                }
            }


        }
    }
</style>
