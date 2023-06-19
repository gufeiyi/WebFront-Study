<template>
    <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from 'echarts';
export default {
    name:'barChart',
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        
        // 配置数据
        lineCharts.setOption({
            xAxis:{
                // 隐藏x轴坐标
                show:false,
                // 横坐标均分
                type:'category'
            },
            yAxis:{
                // 隐藏y轴坐标
                show:false,
            },
            // 系列
            series:[
                {
                    type:'bar',
                    data:[10,7,33,12,88,9,36,45,36],
                    color:'skyblue'
                }
            ],
            // 布局模式
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
            tooltip:{}
        });
    },
}
</script>

<style scoped>
.charts{
    width: 100%;
    height: 100%;
}
</style>