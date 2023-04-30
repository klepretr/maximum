<template>
  <layout-component appName="Maximum" />
  <main class="container ml-5 mr-5">
    <router-view />
  </main>
</template>
<script>
import LayoutComponent from "@/components/layout/LayoutComponent.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    LayoutComponent,
  },
});
</script>

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
  --color-white: #f8f5ef;
  background: var(--color-white);
}
</style>
