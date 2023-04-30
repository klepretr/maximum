<template>
  <div class="home">
    <SearchComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchComponent from "@/components/search-form/SearchFormComponent.vue";

export default defineComponent({
  name: "HomeView",
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
