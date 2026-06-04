<template>
  <router-view />
</template>

<script setup>
// 无需写任何代码
onMounted(()=>{
  console.log('含有token重新获取菜单-或者刷新页面获取菜单');
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei", sans-serif;
}

// 全局滚动条美化
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>