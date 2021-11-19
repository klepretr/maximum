<template>
  <section>
    <form @submit="$event.preventDefault()">
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
          <input
            type="date"
            id="date"
            name="date"
            v-model="from_date"
            required
          />
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
        <button
          :disabled="!isSearchReadyToStart"
          :aria-busy="isSearchLoading"
          @click="onClickSearch"
        >
          {{ isSearchLoading ? "" : "Rechercher..." }}
        </button>
        <span></span>
      </div>
    </form>
  </section>
  <!-- Switch -->
  <section id="results">
    <article v-if="isSearchLoading">
      <progress></progress>
      Recherche en cours...
    </article>
    <div v-if="isSearchReady">
      <fieldset>
        <label for="switch">
          <input
            type="checkbox"
            id="switch"
            name="switch"
            role="switch"
            v-model="showOnlyAvailableJourneys"
          />
          Cacher les trajets indisponibles
        </label>
      </fieldset>
      <section
        v-for="(journeys, date) in journeysFiltered(showOnlyAvailableJourneys)"
        :key="date"
      >
        <div class="ml-5 ta-l date" v-if="journeys.length > 0">
          {{ humanizeDate(date) }}
        </div>
        <JourneyElement
          v-for="journey in journeys"
          v-bind:key="journey.id"
          :journey="journey"
        ></JourneyElement>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import store from "../store";
import {
  titleCaseGare,
  formatDate,
  formatTime,
  formatDateFromHoursAndMinutes,
  humanizeDate,
} from "../utils";
import { APIv2QueryParams, Journey } from "@/models/query_params";
import JourneyElement from "./JourneyElement.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    JourneyElement,
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
      isSearchReadyToStart: false,
      isSearchReady: false,
      showOnlyAvailableJourneys: true,
      departure: "",
      arrival: "",
      from_date: formatDate(new Date()),
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
    humanizeDate: function () {
      return humanizeDate;
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
      this.arrival = "";
      this.isSearchReadyToStart =
        this.departure != null && this.departure.trim() !== "";
      store
        .dispatch("getArrivalStations", { departure: this.departure })
        .then(() => {
          this.isArrivalReady = true;
        });
    },
    onClickSearch() {
      this.isSearchLoading = true;
      this.isSearchReady = false;
      const refine = [`origine:${this.departure}`];
      if (this.arrival) {
        refine.push(`destination:${this.arrival}`);
      }
      const parameters: APIv2QueryParams = {
        limit: 100,
        offset: 0,
        where: `date >= date'${this.from_date}'`,
        order_by: "date asc, heure_depart asc",
        refine,
      };
      store.dispatch("getJourneys", parameters).then(() => {
        this.isSearchLoading = false;
        this.isSearchReady = true;
        var elem = document.querySelector("#results");
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      });
    },
    journeysFiltered: (showOnlyAvailableJourneys: boolean) => {
      const groupByDays: { [key: string]: Journey[] } = {};
      const results: Journey[] =
        store.getters[
          showOnlyAvailableJourneys
            ? "getJourneysOnlyAvailables"
            : "getJourneys"
        ];
      results.forEach((journey) => {
        const date = journey.date.toString();
        if (date in groupByDays) {
          groupByDays[date].push(journey);
        } else {
          groupByDays[date] = [journey];
        }
      });
      return groupByDays;
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

.date {
  font-weight: 600;
}
</style>
