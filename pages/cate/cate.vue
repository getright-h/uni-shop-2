<template>
    <view>
        <!-- container -->
        <view class="cate-box-container">
            <!-- left side -->
            <scroll-view class="left-box" scroll-y="true" :style="{height :wh + 'px'}">
                <!-- block  -->
                <block v-for="(item,index) in cateList" :key="index">
                    <view :class="['left-scroll-view-item',index === active ? 'active' : '' ]" @click="activeHandler(index)">
                        {{item.cat_name}}
                    </view>
                </block>
            </scroll-view>
            <!-- right side -->
            <!-- 点击左侧一级分类时，右侧需要回到顶部 -->
            <scroll-view class="right-box" :scroll-top="scrollTop" scroll-y="true" :style="{height : wh + 'px'}">
                <!-- 二级分类 -->
                <view class="cate-v2" v-for="(item2,index2) in cateV2" :key="index2">
                    <!-- 二级 标题 -->
                    <view class="cate-v2-title">
                        {{item2.cat_name}}
                    </view>
                    <!-- 三级分类 -->
                    <view class="cate-v3">
                        <view @click="goGoodsList(item3.cat_id)" class="cate-v3-item" v-for="(item3,index3) in item2.children" :key="index3">

                            <image :src="item3.cat_icon" mode=""></image>
                            <text>
                                {{item3.cat_name}}
                            </text>

                        </view>

                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                //用户屏幕高度
                wh: 0,
                //分类列表
                cateList: [],
                //二级分类
                cateV2: [],
                //激活项
                active: 0,
                //接口替换的正则
                cateReg: /dev/gi,
                //回到顶部
                scrollTop: 0
            };
        },
        onLoad() {
            //获取用户屏幕的可用高度
            const sysInfo = uni.getSystemInfoSync()
            this.wh = sysInfo.windowHeight
            //获取分类数据
            this.getCatrList()
        },
        methods: {
            //分类请求
            async getCatrList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/categories')
                if (res.meta.status !== 200) {
                    return uni.$showToast('分类信息请求失败')
                } else {
                    //接口有问题，正则替换一下
                    this.cateList = res.message
                    this.cateList.forEach(item => {
                        //有些item可能没有下辖的children，会导致遍历失败，所以要判断一下
                        if (!item.children) return
                        item.children.forEach(item2 => {
                            if (!item2.children) return
                            item2.children.forEach(item3 => {
                                if (!item3) return
                                // item3.cat_icon = 'xx'
                                const foo = item3.cat_icon.replace(this.cateReg, "web");
                                item3.cat_icon = foo
                            })
                        })
                    })
                    //储存二级分类 默认显示第一项
                    this.cateV2 = this.cateList[0].children
                }
            },
            //切换active
            activeHandler(i) {
                this.active = i
                //同切换二级 分类
                this.cateV2 = this.cateList[i].children
                //使右侧滚动条回到顶部
                // 让 scrollTop 的值在 0 与 1 之间切换 用户不会感到差别
                //因为光是让是scrolltop = 0 的话，编译器不会解析，需要两次的值不一样
                this.scrollTop = this.scrollTop === 0 ? 1 : 0
            },
            //跳转到商品详情页
            goGoodsList(v) {
                uni.navigateTo({
                    url: '/subpck/goods_detail/goods_detail?cid=' + v
                })
            }
        }
    }
</script>

<style lang="scss">
    .cate-box-container {
        display: flex;

        // 左侧盒子
        .left-box {
            width: 140rpx;

            // 左侧盒子子项
            .left-scroll-view-item {
                line-height: 120rpx;
                background-color: #f7f7f7;
                text-align: center;
                font-size: 24rpx;

                // 左侧子项激活区域
                &.active {
                    background-color: #ffffff;
                    position: relative;

                    &::before {
                        display: block;
                        content: '';
                        width: 3px;
                        height: 30px;
                        background-color: #c00000;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }

        // 右侧盒子
        .right-box {
            display: flex;
            flex: 1;

            // 二级标题
            .cate-v2-title {
                font: size 24rpx;
                text-align: center;
                padding: 30rpx 0;
                font-weight: bold;
            }

            //三级分类
            .cate-v3 {
                display: flex;
                flex-wrap: wrap;

                .cate-v3-item {
                    width: 33.33%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    image {
                        width: 60px;
                        height: 60px;
                    }

                    text {
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>
