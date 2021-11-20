<template>
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
.home {
  margin-top: 15px;
}
</style>
