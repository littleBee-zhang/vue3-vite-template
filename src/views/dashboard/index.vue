<template>
  <div style="width: 800px; height: 400px; border: 1px solid #eee;">
    <!-- 自动滚动容器，限定高度产生滚动 -->
    <AutoScroll :step="0.5" :interval="70">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="value" label="数值" />
        <el-table-column prop="time" label="时间" />
      </el-table>
    </AutoScroll>
  </div>
</template>

<script setup lang="ts">
import AutoScroll from './AutoScroll.vue'

// 模拟大量数据，触发滚动
const tableData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `数据条目${i + 1}`,
  value: Math.floor(Math.random() * 1000),
  time: new Date().toLocaleString()
}))
</script>