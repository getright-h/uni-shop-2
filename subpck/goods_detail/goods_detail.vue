<template>
    <!-- 解决请求未返回时，显示undefined -->
    <view v-if="isNull" class="goods-detail-container">
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for="(item,index) in goods_info.pics" :key="index">
                <image :src="item.pics_big" @click="preview(index)"></image>
            </swiper-item>
        </swiper>

        <!-- 商品信息区域 -->
        <view class="goods-info-box">
            <!-- 价格区 -->
            <view class="goods-info-price">
                ￥{{goods_info.goods_price}}
            </view>
            <!-- 主体区 -->
            <view class="goods-info-body">
                <!-- 名称 -->
                <view class="goods-info-name">
                    {{goods_info.goods_name}}
                </view>
                <!-- 搜藏 -->
                <view class="goods-info-favi">
                    <uni-icons type="star" size="16"></uni-icons>
                    <text>搜藏</text>
                </view>
            </view>
            <!-- 运费区 -->
            <view class="goods-info-freight">
                快递：免运费
            </view>
        </view>

        <!-- 商品内容区域 -->
        <rich-text :nodes="goods_info.goods_introduce"></rich-text>
        <!-- 底部导航 -->
        <view class="goods-nav-bottom">
            <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup"
                @click="onClick" />
        </view>

    </view>
</template>

<script>
    export default {
        onLoad(options) {
            //根据路由获取对应商品id
            const goods_id = options.goods_id
            //发送请求
            this.getGoodsDetail(goods_id)
        },
        computed: {
            // 解决请求未返回时，显示undefined 判断存放响应信息的对象是否为空
            isNull() {
                let foo = Object.keys(this.goods_info)
                return foo.length
            }
        },
        data() {
            return {
                //商品详情
                goods_info: {},
                //底部导航栏
                options: [{
                    icon: 'shop',
                    text: '店铺',
                    infoBackgroundColor: '#007aff',
                    infoColor: "red"
                }, {
                    icon: 'cart',
                    text: '购物车',
                    info: 2
                }],
                buttonGroup: [{
                        text: '加入购物车',
                        backgroundColor: '#ff0000',
                        color: '#fff'
                    },
                    {
                        text: '立即购买',
                        backgroundColor: '#ffa200',
                        color: '#fff'
                    }
                ]
            };
        },
        methods: {
            //点击跳转到购物车
            onClick(e) {
                if (e.content.text === "购物车") {
                    uni.switchTab({
                        url: '/pages/cart/cart'
                    })
                }

            },
            //轮播图预览
            preview(i) {
                uni.previewImage({
                    current: i,
                    //所有图片的urls数组 去重后
                    urls: this.goods_info.pics.map(item => item.pics_big)
                })
            },
            //获取商品详情函数
            async getGoodsDetail(id) {
                const {
                    data
                } = await uni.$http.get('/api/public/v1/goods/detail', {
                    goods_id: id
                })
                if (data.meta.status !== 200) return uni.$showMsg()
                //做预处理 图片底部有留白 是因为图片底部默认和文字基线对齐 displacy block可以解决
                //后者是处理ios端 对webp格式图片兼容不好的问题
                data.message.goods_introduce = data.message.goods_introduce.replace(/<img /g,
                    '<img style="display:block"').replace(/.webp/g, '.jpg')
                this.goods_info = data.message
            }
        }
    }
</script>

<style lang="scss">
    //外层容器
    .goods-detail-container {
        //使得底部内容不被导航烂遮盖
        padding-bottom: 50px;
    }

    // 轮播图
    swiper {
        height: 750rpx;

        image {
            height: 100%;
            width: 100%;
        }
    }

    // 商品信息
    .goods-info-box {
        display: flex;
        flex-direction: column;
        padding: 40rpx;

        .goods-info-price {
            color: darkred;
            font-size: 44rpx;
        }

        .goods-info-body {
            display: flex;
            justify-content: space-between;

            .goods-info-name {
                font-size: 26rpx;
                flex: 1;
                padding-right: 20rpx;
            }

            .goods-info-favi {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 24rpx;
                width: 60rpx;
                border-left: 2rpx solid #efefef;
                color: gray;

            }
        }

        .goods-info-freight {
            margin: 20rpx 0;
            font-size: 24rpx;
            color: gray;
        }

    }

    //底部导航
    .goods-nav-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
