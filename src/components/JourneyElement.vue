<template>
  <article :class="{ disable: !journey.available }">
    <div class="custom-grid">
      <div class="station">
        <span class="station_label">de</span>
        <span class="station_name">{{ titleCaseGare(journey.origine) }}</span>
      </div>
      <div class="ta-e">
        {{ journey.available ? "disponible" : "indisponible" }}
      </div>
      <div>
        <fieldset v-if="journey.available">
          <label for="terms">
            <input type="checkbox" id="terms" name="terms" />
          </label>
        </fieldset>
      </div>
      <div class="spliter"></div>
      <div class="ta-e timesheet merge-col-ends">
        {{ journey.heure_depart }} ➔ {{ journey.heure_arrivee }}
      </div>
      <div class="station">
        <span class="station_label">vers</span>
        <span class="station_name">{{
          titleCaseGare(journey.destination)
        }}</span>
      </div>
      <div class="ta-e number merge-col-ends">
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

fieldset {
  margin-bottom: 0;
}

.disable {
  background-color: #7575753d;
  opacity: 0.7;
}

.custom-grid {
  grid-template-columns: 2fr 1fr 4%;
  grid-template-rows: 1 1.5em 1;
  grid-column-gap: 2em;
  display: grid;
  justify-self: stretch;
  vertical-align: middle;
  text-align: left;
}

.station_label {
  font-size: 12px;
}

.station_name {
  margin-left: 5px;
  font-weight: 600;
}

.timesheet {
  font-weight: 1000;
}

.merge-col-ends {
  grid-column-start: 2;
  grid-column-end: 4;
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
