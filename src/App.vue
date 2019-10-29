<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    localStorage.setItem("goodList", 1)
    localStorage.setItem("supplier", 1)
    localStorage.setItem("orderList", 1)
  }
}
</script>

<style>
  @import "../static/css/main.css";
</style>
