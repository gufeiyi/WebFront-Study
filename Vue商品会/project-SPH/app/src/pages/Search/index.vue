<template>
  <div>
    <!-- 商品分类的三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName }}
              <i @click="removeCategoryName">×</i>
            </li>

            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}
              <i @click="removeKeyword">×</i>
            </li>

            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="removeTrademark">×</i>
            </li>

            <!-- 平台售卖属性的面包屑 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}
              <i @click="removeAttrValue(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 展示商品的导航栏 -->
              <!-- 排序的结构 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合<span v-show="isOne"
                      ><span v-show="isAsc">⬆</span
                      ><span v-show="isDesc">⬇</span></span
                    ></a
                  >
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格<span v-show="isTwo"
                      ><span v-show="isAsc">⬆</span
                      ><span v-show="isDesc">⬇</span></span
                    ></a
                  >
                </li>
                <!-- <li>
                  <a href="#">价格⬆</a>
                </li>
                <li>
                  <a href="#">价格⬇</a>
                </li> -->
              </ul>
            </div>
          </div>

          <!-- 销售的产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转的时候，带params参数 -->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                    >
                      {{ good.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 分页器 -->
          <!-- 父组件给子组件传递数据 -->
          <!-- 
            pageNo：当前页数
            pageSize：每页几条数据
            total：总共多少条数据
            continues：中间连续展示的页码数
           -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 带给服务器的参数
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryName: "", //分类的名字
        keyword: "", //关键字
        order: "1:desc", //排序: 初始状态为综合降序
        pageNo: 1, //当前页数,默认展示第一页
        pageSize: 3, //每页展示的个数
        props: [], //平台售卖属性所带的参数
        trademark: "", //品牌
      },
    };
  },
  beforeMount() {
    // 在页面挂载之前把向服务器请求的参数准备好,挂载完之后,向服务器请求数据再进行页面展示

    // 复杂的写法
    /* this.searchParams.category1Id = this.$route.query.category1Id;
    this.searchParams.category2Id = this.$route.query.category2Id;
    this.searchParams.category3Id = this.$route.query.category3Id;
    this.searchParams.categoryName = this.$route.query.categoryName;
    this.searchParams.keyword = this.$route.params.keyWord; */

    // E6新增语法：assign，合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // console.log(this.$route);
  },
  mounted() {
    // 测试接口返回的数据格式
    this.getSearchData();
  },
  computed: {
    // 注意mapGetters里面传的是数组
    ...mapGetters(["goodsList"]),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    // 获取search模块仓库里的total
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
  },
  methods: {
    // 向服务器发请求获取search模块的数据
    getSearchData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 删除分类的名字
    removeCategoryName() {
      // 写成undefined，不会带给服务器
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 向服务器发请求
      this.getSearchData();

      // 地址栏也需要改，要进行路由跳转，自己跳自己
      // 注意路由跳转用的是$router
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    // 删除关键字
    removeKeyword() {
      this.searchParams.keyword = undefined;
      // 再发请求
      this.getSearchData();

      // 通知兄弟组件Header清除关键字
      this.$bus.$emit("clear");

      // 地址栏也要改，进行路由跳转
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    // 自定义的事件回调
    trademarkInfo(trademark) {
      // 整理参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 再次发请求
      this.getSearchData();
    },
    // 删除品牌
    removeTrademark() {
      this.searchParams.trademark = undefined;
      // 再发请求
      this.getSearchData();
    },
    // 点击售卖属性后父组件的回调
    attrInfo(attr, attrValue) {
      // 整理数据
      // 要的参数格式["属性ID:属性值:属性名"]
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 先判断是否需要去重
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
      }
      // 发请求
      this.getSearchData();
    },
    // 删除售卖属性搜索结果
    removeAttrValue(index) {
      // 再次整理参数
      this.searchParams.props.splice(index, 1);
      // 再发请求
      this.getSearchData();
    },
    // 排序的操作
    changeOrder(flag) {
      // flag代表用户点击的是综合还是价格
      // 起始的状态
      let originOrder = this.searchParams.order;
      let orientFlag = originOrder.split(":")[0];
      let orientSort = originOrder.split(":")[1];
      let newOrder = "";
      if (flag == orientFlag) {
        // 用户点击的是综合（降序）
        newOrder = `${orientFlag}:${orientSort == "desc" ? "asc" : "desc"}`;
      } else {
        // 用户点击的是价格(默认是降序)
        newOrder = `${flag}:${"desc"}`;
      }
      // 修改参数
      this.searchParams.order = newOrder;
      // 再发请求
      this.getSearchData();
    },
    // 自定义事件的回调，获取当前页数
    getPageNo(pageNo) {
      // 整理服务器带回来的参数
      this.searchParams.pageNo = pageNo;
      // 再次发请求
      this.getSearchData();
    },
  },
  // 数据监听
  watch: {
    // 监听路由的信息是否发生变化
    $route() {
      // 整理带给服务器的参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // 再次发请求
      this.getSearchData();
      // 每次请求完毕，应该把相应的1、2、3级分类的id置空
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>