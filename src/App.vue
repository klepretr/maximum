<template>
  <main class="container ml-5 mr-5">
    <router-view />
  </main>
</template>

<style lang="scss">
@import "@/style/microclasses.scss";
@import "@/../node_modules/@picocss/pico/scss/pico.scss";
@import "@/style/custom.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

:root {
  width: 100%;
  height: 100%;
}
</style>
