<template>
    <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from 'echarts';
export default {
    name:'progressChart',
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        
        // 配置数据
        lineCharts.setOption({
            xAxis:{
                // 隐藏x轴坐标
                show:false,
                min:0,
                max:100
            },
            yAxis:{
                // 隐藏y轴坐标
                show:false,
                // 纵坐标均分
                type:'category'
            },
            // 系列
            series:[
                {
                    type:'bar',
                    data:[78],
                    color:'pink',
                    barWidth:10,
                    // 背景颜色的设置
                    showBackground:true,
                    backgroundStyle:{
                        color:'#eee'
                    },
                    // 柱状图文本
                    label:{
                        // 是否展示文本
                        show:true,
                        // 改变文本内容
                        formatter:"|",
                        // 文本标签位置的调试
                        position:'right'
                    }
                }
            ],
            // 布局模式
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
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