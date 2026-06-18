<template>
  <div>
    <!-- 有子菜单 → 且不隐藏 -->
    <el-sub-menu v-if="item.children && item.children.length && !item.hidden" :index="item.path">
      <template #title>
        <el-icon>
          <component v-if="item.meta.icon !== 'SvgIcon'" :is="item?.icon || item?.meta?.icon" />
          <Icon v-else :name="item.meta.svgName" />
        </el-icon>
        <span v-if="!collapse">{{ item?.menuName || item?.name || item?.meta?.title }}</span>
        <!-- <span >{{ item?.menuName || item?.name || item?.meta?.title }}</span> -->
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :item="child" :collapse="collapse" />
    </el-sub-menu>

    <!-- 无children → 且不隐藏 -->
    <el-menu-item v-else-if="!item.hidden" :index="item.path">
      <el-icon>
        <component v-if="item.meta.icon !== 'SvgIcon'" :is="item?.icon || item?.meta?.icon" />
        <Icon v-else :name="item.meta.svgName" />
      </el-icon>
      <span v-if="!collapse">{{ item?.menuName || item?.name || item?.meta?.title }}</span>
      <!-- <span >{{ item?.menuName || item?.name || item?.meta?.title }}</span> -->
    </el-menu-item>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  collapse: { // 接收折叠状态
    type: Boolean,
    default: false
  }
})
</script>