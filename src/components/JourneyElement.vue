<template>
  <article :class="{ disable: !journey.available }">
    <div class="custom-grid">
      <div class="arrival">
        <span class="arrival_label">de</span>
        <span class="arrival_name">{{ titleCaseGare(journey.origine) }}</span>
      </div>
      <div class="ta-e mr-5">
        {{ journey.available ? "disponible" : "indisponible" }}
      </div>
      <div class="spliter"></div>
      <div class="ta-e timesheet">
        {{ journey.heure_depart }} ➔ {{ journey.heure_arrivee }}
      </div>
      <div class="arrival">
        <span class="arrival_label">vers</span>
        <span class="arrival_name">{{
          titleCaseGare(journey.destination)
        }}</span>
      </div>
      <div class="ta-e number">
        train n°<span style="font-weight: 600">{{ journey.train_no }}</span>
      </div>
    </div>
  </article>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { titleCaseGare } from "../utils";

export default defineComponent({
  name: "JourneyElement",
  props: {
    journey: Object,
  },
  computed: {
    titleCaseGare: function () {
      return titleCaseGare;
    },
  },
});
</script>
<style lang="scss" scoped>
article {
  margin: 15px 0 15px 0;
  padding: 20px;
}

.disable {
  background-color: #7575753d;
  opacity: 0.7;
}

.custom-grid {
  grid-template-columns: 2fr 1.5fr;
  grid-template-rows: 1 1.5em 1;
  grid-column-gap: 2em;
  display: grid;
  justify-self: stretch;
  vertical-align: middle;
  text-align: left;
}

.arrival_label {
  font-size: 12px;
}

.arrival_name {
  margin-left: 5px;
  font-weight: 600;
}

.timesheet {
  font-weight: 1000;
}

.number {
  font-size: 14px;
  margin-top: 5px;
}

.spliter {
  border-left-width: medium;
  border-left-style: solid;
  border-left-color: #7575754f;
}
</style>
