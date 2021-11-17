<template>
  <div class="mt-5">
    <form class="ml-5 mr-5">
      <div class="custom-grid">
        <label for="from_stations">
          Gare de départ
          <select
            @change="onChangeDeparture"
            :disabled="!isDepartureReady"
            :aria-busy="!isDepartureReady"
            v-model="departure"
            id="from_stations"
          >
            <option value="" disabled selected>Départ...</option>
            <option
              v-for="station in departureStations"
              v-bind:key="station"
              :value="station"
            >
              {{ titleCaseGare(station) }}
            </option>
          </select>
        </label>
        <label for="to_stations">
          Gare d'arrivée
          <select
            :disabled="!isArrivalReady"
            v-model="arrival"
            id="to_stations"
          >
            <option value="" disabled selected>Arrivée...</option>
            <option
              v-for="station in arrivalStations"
              v-bind:key="station"
              :value="station"
            >
              {{ titleCaseGare(station) }}
            </option>
          </select>
        </label>
      </div>
      <div class="custom-grid mt-5">
        <label for="date">
          A partir de
          <input type="date" id="date" name="date" v-model="from_date" />
        </label>
        <label for="departure_hour">
          &#8203;
          <select id="departure_hour">
            <option :value="currentTime" selected>
              {{ currentTime.label_time }}
            </option>
            <option disabled></option>
            <option v-for="hour in hours" v-bind:key="hour">
              {{ hour.label }}
            </option>
          </select>
        </label>
      </div>
      <div class="grid">
        <span></span>
        <button :aria-busy="isSearchLoading" @click="onClickSearch">
          Rechercher...
        </button>
        <span></span>
      </div>
    </form>
    <hr />
    <article v-for="journey in journeys" v-bind:key="journey.id">
      <header>{{ journey.date }} - {{ journey.heure_depart }}</header>
      {{ journey.train_no }}
      <footer>{{ journey.od_happy_card }}</footer>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import store from "../store";
import { titleCaseGare } from "../utils/title-case.utils";
import dayjs from "dayjs";
import { APIv2QueryParams } from "@/models/query_params";

const padStringZero = (value: number, padding: number) => {
  return String(value).padStart(padding, "0");
};

const formatDateFromHoursAndMinutes = (hours: number, minutes: number) => {
  return `${hours}h${padStringZero(minutes, 2)}`;
};

const formatDate = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

const formatTime = (time: Date) => {
  return `${dayjs(time).format("H")}h${dayjs(time).format("mm")}`;
};

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    store.dispatch("getDepartureStations").then(() => {
      this.isDepartureReady = true;
    });
  },
  data() {
    return {
      isDepartureReady: false,
      isArrivalReady: false,
      isSearchLoading: false,
      departure: "",
      arrival: "",
      from_date: "",
    };
  },
  computed: {
    ...mapGetters({
      departureStations: "getDepartureStations",
      arrivalStations: "getArrivalStations",
      journeys: "getJourneys",
    }),
    titleCaseGare: function () {
      return titleCaseGare;
    },
    hours: () => {
      const minutes = [0, 15, 30, 45];
      const hours = [...Array(24).keys()];
      let result = [];
      for (const hour of hours) {
        for (const minute of minutes) {
          result.push({
            hour,
            minute,
            label: formatDateFromHoursAndMinutes(hour, minute),
          });
        }
      }
      return result;
    },
    currentTime: () => {
      const now = new Date();
      return {
        hour: now.getHours(),
        minute: now.getMinutes(),
        label_time: formatTime(now),
        label_date: formatDate(now),
      };
    },
  },
  methods: {
    onChangeDeparture() {
      this.isArrivalReady = false;
      store
        .dispatch("getArrivalStations", { departure: this.departure })
        .then(() => {
          this.isArrivalReady = true;
        });
    },
    onClickSearch() {
      this.isSearchLoading = true;
      const parameters: APIv2QueryParams = {
        limit: 100,
        offset: 0,
        where: `date >= date'${this.from_date}'`,
        order_by: "date asc, heure_depart asc",
        refine: [`origine:${this.departure}`, `destination:${this.arrival}`],
      };
      store.dispatch("getJourneys", parameters).then(() => {
        this.isSearchLoading = false;
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
label {
  text-align: left;
}

.custom-grid {
  @media (min-width: 50em) {
    grid-template-columns: 1.5fr 1fr;
    grid-column-gap: 2em;
  }
  display: grid;
}
</style>
