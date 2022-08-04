<template>
    <view class="goods-item">
        <!-- 左侧图片 -->
        <view class="left-box">
            <img :src="item.goods_small_logo || defaultPic " class="goods-pic" alt="">
        </view>
        <!-- 右侧文字 -->
        <view class="right-box">
            <view class="goods-name">
                {{item.goods_name}}
            </view>
            <view class="goods-price">
                ￥{{item.goods_price | tofixed}}
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-goods",
        props: {
            item: {
                type: Object,
                default: {}
            }
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
        display: flex;
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

            .goods-price {
                font-size: 36rpx;
                color: darkred;
            }
        }
    }
</style>
