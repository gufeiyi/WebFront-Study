<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg t="1686022478371" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3515" width="16" height="16"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" p-id="3516" fill="#bfbfbf"></path><path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="3517" fill="#bfbfbf"></path><path d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" p-id="3518" fill="#bfbfbf"></path></svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','count'],
}
</script>

<style scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}

.card-content{
  font-size: 30px;
  padding: 10px 0;
}

.card-charts{
  height: 50px;
}

.card-footer{
  border-top: 1px solid #eee;
  padding: 10px 0;
}
</style>