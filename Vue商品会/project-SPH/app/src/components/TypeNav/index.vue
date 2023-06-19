<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派的使用 -->
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>

        <!-- 三级联动 -->
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="showSort">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                  <!-- 声明式路由跳转 -->
                  <!-- 不推荐使用，因为router-link是组件，每次滑动需要产生很多vc实例对象，容易卡顿，耗内存 -->
                  <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                </h3>

                <!-- 二三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 导航 -->
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// 引入所有的lodash
// import _ from 'lodash';
// 按需加载lodash
import throttle from "lodash/throttle";

export default {
  name: "TypeNav",
  data() {
    return {
      // 存储用户鼠标移入哪个一级分类
      currentIndex: -1,
      showSort: true,
    };
  },
  // 组件挂载完毕，可以向服务器请求
  mounted() {
    // 将showSort在home里面为true，在search里面为false
    if (this.$route.path != "/home") {
      this.showSort = false;
    }
  },
  computed: {
    ...mapState({
      /* categoryList:(state) => {
        return state.home.categoryList;
      } */

      // 简写形式
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    // 鼠标进入修改数据currentIndex属性
    /* changeIndex(index) {
      // index是移入一级标签的索引值
      this.currentIndex = index;
    }, */

    // 使用节流
    // 原因：慢速操作：每个一级标题都会触发鼠标移入
    //       但是快速操作，回调函数中有大量业务的话，会出现卡顿现象
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),

    // 鼠标移除事件的回调
    leaveIndex() {
      this.currentIndex = -1;
      if (this.$route.path != "/home") {
        this.showSort = false;
      }
    },
    goSearch(event) {
      // this.$router.push('/search')
      // console.log('跳转');
      // 需要解决事件委派的副作用
      // 1、如何知道点击的是a标签以及如何区分是几级标签
      // 有自定义属性的就是a标签
      // 2、如何收到index和name

      // 自定义标签的参数在event.target.dataset里面
      let element = event.target;
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      // 区分是不是a标签
      if (categoryname) {
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 区分是几级标签
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        if(this.$route.params){
          // console.log(this.$route.params);
          
          location.params = this.$route.params;
          location.query = query;
          this.$router.push(location);
        }
        
      }
    },
    // 鼠标移入的时候，让商品分类进行展示
    enterShow() {
      this.showSort = true;
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 28px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // 使用css的方法显示二三级导航
          /* &:hover {
            .item-list {
              display: block;
            }
          } */
        }

        .cur {
          background-color: skyblue;
        }
      }
    }

    // 过渡动画的样式
    // 过渡动画开始状态（进入）
    .sort-enter{
      height: 0px;
    }

    // 过渡动画结束的状态（进入）
    .sort-enter-to{
      height: 461px;
    }

    // 定义动画的时间和速率
    .sort-enter-active{
      transition: all 0.2s linear;
    }
  }
}
</style>