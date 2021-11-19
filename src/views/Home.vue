<template>
  <nav>
    <div>Maximum</div>
  </nav>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
});
</script>
<style lang="scss" scoped>
nav {
  height: 3em;
  display: flex;
}

nav > div {
  margin: auto;
  font-weight: 600;
}
</style>
