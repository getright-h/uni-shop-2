<template>
    <view>
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
            <swiper-item v-for=" (item,index) in  swiperList" :key="index">
                <!-- 这是编程式导航 -->
                <view class="swiper-item" @click="swiperHandler(item.goods_id)">
                    <image :src="item.image_src"></image>
                </view>
                <!-- 这是声明式导航 -->
                <!-- <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"></navigator> -->
            </swiper-item>
        </swiper>
        <!-- 分类导航 -->
        <view class="nav">

            <view @click="navHandler(item.name)" class="nav_item" v-for="(item,index) in navList" :key="index">
                <image :src="item.image_src"></image>
            </view>
        </view>
        <!-- 楼层展示 -->
        <view class="floor">
            <view class="floor_item" v-for=" (item,index) in floorList" :key="index">
                <!-- 头部标题 -->
                <image class="floor_title" :src="item.floor_title.image_src"> </image>
                <!-- 子类大容器 -->
                <view class="floor_image_box">
                    <!-- left -->
                    <!-- item.product_list[0].url 是请求时经过处理后拼接后的路由跳转地址 -->
                    <navigator :url="item.product_list[0].url" class="left_box">
                        <img :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix">
                    </navigator>
                    <!-- right -->
                    <view class="right_box">
                        <!-- 右边小盒子，除开第一个外的其他四个 -->
                        <navigator :url="item2.url" class="right_box_item" v-for="(item2,key2) in item.product_list" :key="key2" v-if="key2 !== 0">
                            <image :src="item2.image_src" :style="{width:item2.image_width + 'rpx'}" mode="widthFix"></image>
                        </navigator>
                    </view>
                </view>

            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                //轮播图
                swiperList: [],
                //分类导航
                navList: [],
                //楼层
                floorList: []
            };
        },
        onLoad() {
            //页面加载
            //发送轮播图请求
            this.getSwiperList()
            //发送分类导航请求
            this.getNavList()
            //发送楼层请求
            this.getFloorList()
        },
        methods: {
            //轮播图请求
            async getSwiperList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/swiperdata')
                if (res.meta.status !== 200) {
                    return uni.$showToast('轮播图请求失败')
                } else {
                    this.swiperList = res.message
                }

            },
            //分类导航请求
            async getNavList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/catitems')
                res.meta.status === 200 ? this.navList = res.message : uni.$showToast('分类导航请求失败')
                /* if (res.meta.status !== 200) {
                     return uni.$showToast('分类导航请求失败')
                 } else {
                     this.navList = res.message
                 } */
            },
            //楼层请求
            async getFloorList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/floordata')
                if (res.meta.status !== 200) {
                    return uni.$showToast('楼层请求失败')
                } else {
                    //预处理res中的url字段，在前面拼接上本地跳转页面的前缀
                    //第一次循环拿到除开title的子类
                    res.message.forEach(item => {
                        //第二次循环拿到子类的每个跳转路径
                        item.product_list.forEach(item2 => {
                            //对每个跳转路径做处理，拿到 ? 分割后的参数后半段(下标为1),并且拼接上分包地址
                            // "/pages/goods_list?query=服饰"
                            item2.url = '/subpck/goods_list/goods_list?' + item2.navigator_url.split('?')[1]
                        })
                    })
                    this.floorList = res.message
                }
            },


            //轮播图跳转函数
            swiperHandler(e) {
                wx.navigateTo({
                    url: `/subpck/goods_detail/goods_detail?goods_id=${e}`
                })
            },
            //导航跳转函数
            navHandler(e) {
                if (e === '分类') {
                    wx.switchTab({
                        url: '/pages/cate/cate'
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    // 轮播图
    swiper {
        height: 330rpx;

        .swiper-item,
        image {
            width: 100%;
            height: 100%;
        }
    }

    // 导航分类
    .nav {

        display: flex;
        justify-content: space-around;
        margin: 15px 0;

        image {
            width: 128rpx;
            height: 140rpx;
        }
    }

    //楼层
    // 标题
    .floor_title {
        width: 100%;
        height: 60rpx;

    }

    // 子类大容器
    .floor_image_box {
        display: flex;
        flex-wrap: nowrap;
    }

    // 右侧盒子
    .right_box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
</style>
