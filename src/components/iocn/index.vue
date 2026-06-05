<template>
  <svg class="svg-icon" :style="{fontSize:size+'px',color}">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>
<script setup>
const props = defineProps({
  name:String,size:{default:18},color:{default:''}
})
</script>
<style>
.svg-icon{width:1em;height:1em;vertical-align:-0.15em;fill:currentColor;}
</style>