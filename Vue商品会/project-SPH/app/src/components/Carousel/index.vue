<template>
  <div class="swiper" id="mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper, { Navigation, Pagination } from "swiper";
Swiper.use([Navigation, Pagination]);
export default {
  name: "Carousel",
  props: ["list"],
  watch: {
    // 监听bannerList数据的变化
    list: {
      immediate: true,
      handler() {
        // 执行了handler,说明数据已经从空数组变成了有数据
        // 只能保证bannerList已经有数据了,但是不一定是4个数据都有了

        // nextTick:
        // 使用时间,在下次DOM更新,循环结束之后,延迟执行回调(页面所有数据,结构完整之后再执行)
        // 使用时间,在修改数据之后,立即使用这个方法,修改更新后的DOM(每次数据变化后)
        this.$nextTick(() => {
          var mySwiper = new Swiper("#mySwiper", {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
</script>

<style scoped>
</style>