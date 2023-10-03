<template>
  <div><router-view /></div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})
</script>
<style>
.box{
  margin: 5px 60px;
  max-height: 100%;
  max-width: 100%;
  border-radius: 25px;
  background-color: #F8F8F8;
}
</style>