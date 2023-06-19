<template>
  <div> 
    <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.add3')!=-1">添加按钮3</el-button>
  </div>
</template>

<script>
export default {
    name:'Study2'
}
</script>

<style scoped>
</style>