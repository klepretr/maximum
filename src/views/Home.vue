<template>
  <nav>
    <div>Maximum</div>
  </nav>
  <div class="home">
    <SearchComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchComponent from "@/components/SearchComponent.vue";

export default defineComponent({
  name: "Home",
  components: {
    SearchComponent,
  },
});
</script>
<style lang="scss" scoped>
nav {
  height: 3em;
  display: flex;
  font-size: 22px;
}

nav > div {
  margin: auto;
  font-weight: 600;
}
</style>
