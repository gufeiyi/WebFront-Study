<template>
  <div class="pagination">
    <!-- 当前页为第一页不能点击 -->
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button
      v-if="startNumAndEndNum.start > 1"
      @click="$emit('getPageNo', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <button v-if="startNumAndEndNum.start > 2">···</button>

    <!-- 中间部分：用v-for遍历 -->
    <!-- 假如 当前页是8 显示 6 7 8 9 10 -->
    <!-- v-for 遍历之后得到的数据 1 2 3 ... 10-->
    <!-- v-if 隐藏之后变成 6 7 8 9 10 -->
    <!-- 因为小于startNumAndEndNum.start的数字被隐藏掉了 -->
    <button
      v-for="(page, index) in startNumAndEndNum.end"
      :key="index"
      v-if="page >= startNumAndEndNum.start"
      @click="$emit('getPageNo', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>
    <!-- <button>{{startNumAndEndNum.start}}</button>
    <button>{{startNumAndEndNum.start+1}}</button>
    <button>{{pageNo}}</button>
    <button>{{startNumAndEndNum.end-1}}</button>
    <button>{{startNumAndEndNum.end}}</button> -->

    <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
    <button
      v-if="startNumAndEndNum.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
      :class="{active:pageNo==totalPage}"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('getPageNo', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共{{ total }}条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    totalPage() {
      // Math.ceil向上取整
      return Math.ceil(this.total / this.pageSize);
    },
    startNumAndEndNum() {
      // 写了这条代码就不用一直this.
      const { continues, pageNo, totalPage } = this;
      let start = 0,
        end = 0;
      // 连续的页数至少是5，不够5需要特殊处理一下
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        // 正常现象
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);

        // 不正常现象
        // 当前页数为1 （-1 0 1 2 3）和 2（0 1 2 3 4）
        if (start < 1) {
          start = 1;
          end = continues;
        }
        // end大于总页码
        if (end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }

      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active{
    background-color: skyblue;
}
</style>
