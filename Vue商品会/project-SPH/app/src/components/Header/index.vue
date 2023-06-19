<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有用户名的时候显示，未登录 -->
          <p v-if="!userName">
            <span>请</span>
            <!-- 声明式导航 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <!-- 有用户名，用户已登录 -->
          <p v-else>
            <a>{{ userName }}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopCart">我的购物车</router-link>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="@/assets/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <!-- 编程式导航 -->
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch()"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    // 搜索按钮的回调函数，调转到搜索界面
    goSearch() {
      // 路由传参
      // params参数。 /search/传的参数，需要占位
      // query参数，  /search?传的参数，不需要占位
      // 第一种：字符串的形式
      // this.$router.push('/search/'+ this.keyWord+'?k='+this.keyWord.toUpperCase());

      // 第二种：模板字符串
      // this.$router.push(`/search/${this.keyWord}?k=${this.keyWord}`)

      // 第三种：对象的方式
      // 注意：params参数，采用对象的写法必须用name，不能只用path

      // 面试题
      // 1、路由传递参数（对象写法），path不可以结合params参数一起使用。
      // 2、如何指定params参数可传可不传，也就是在路由的占位后面加？
      // 3、params参数传的是空串，url有问题，可以传递undefind，keyWord="" || undefind
      // 4、路由可以传递prosps参数，三种形式
      /* this.$router.push(
                {
                    name:'search',
                    params:{
                        keyWord:this.keyWord
                    },
                    query:{
                        k:this.keyWord
                    }
                },
                // 参数不变，多次执行搜索会抛出NavigationDuplicated的警告错误
                // 产生原因：push的底层引入了promise
                // 解决方法就是传递成功和失败的回调
                // (success)=>{},
                // (error)=>{}
            ) */

      if (this.$route.query) {
        let location = {
          name: "search",
          params: { keyword: this.keyword || undefined },
        };
        location.query = this.$route.query;
        this.$router.push(location);
      }
    },
    // 退出登录
    async logout() {
      // 发请求通知服务器,清除TOKEN
      // 清除项目中的数据
      try {
        // 如果退出成功,回到首页
        await this.$store.dispatch("userLogout");
        this.$router.push('/home')
      } catch (error) {}
    },
  },
  mounted() {
    // 通过全局事件总线清除关键字
    this.$bus.$on("clear", () => {
      this.keyword = "";
    });
    // 放Header里面也不行,和放app里面一样,
    // header和app就挂载一次,挂载的时候,用户没登陆,
    // 收不到用户数据,只有更新的时候才有数据
    // 获取用户信息在首页展示
    // this.$store.dispatch("getUserInfo");
  },
  computed: {
    // 用户名信息
    userName() {
      return this.$store.state.user.userInfo.name;
    },
  },
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>