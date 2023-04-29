<template>
  <section class="mb-3">
    <h4 class="ta-l">Recherche de trajets</h4>
    <form @submit="$event.preventDefault()">
      <div class="row-one-grid">
        <div class="departure-grid">
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
              <optgroup v-if="departureStationsFavorites.length > 0">
                <option
                  v-for="station in departureStationsFavorites"
                  v-bind:key="station.name"
                  :value="station"
                >
                  {{ titleCaseGare(station.name) }}
                </option>
              </optgroup>
              <option
                v-for="station in departureStationsNotFavorite"
                v-bind:key="station.name"
                :value="station"
              >
                {{ titleCaseGare(station.name) }}
              </option>
            </select>
          </label>
          <label for="favorite_btn">
            &#8203;
            <button
              :disabled="!isSearchReadyToStart"
              id="favorite_btn"
              @click="handleFavorite(departure)"
              :value="departure"
              :class="{ selected: departure.favorite }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="star"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
            </button>
          </label>
        </div>
        <label for="to_stations">
          Gare d'arrivée
          <select
            @change="onChangeArrival()"
            :disabled="!isArrivalReady"
            v-model="arrival"
            id="to_stations"
          >
            <option value="" disabled selected>Arrivée...</option>
            <optgroup v-if="arrivalStationsFavorites.length > 0">
              <option
                v-for="station in arrivalStationsFavorites"
                v-bind:key="station.name"
                :value="station.name"
              >
                {{ titleCaseGare(station.name) }}
              </option>
            </optgroup>
            <option
              v-for="station in arrivalStationsNotFavorite"
              v-bind:key="station.name"
              :value="station.name"
            >
              {{ titleCaseGare(station.name) }}
            </option>
          </select>
        </label>
      </div>
      <div class="row-two-grid mt-5">
        <label for="date">
          A partir du
          <input
            type="date"
            id="date"
            name="date"
            v-model="from_date"
            required
          />
        </label>
        <label>
          <small class="ta-l di-b custom-label">
            dernière mise à jour des trajets :
            <em
              :data-tooltip="
                lastUpdateDataset ? lastUpdateDataset.format('LLL') : null
              "
            >
              {{ humanizeDateDiff(lastUpdateDataset) || "indisponible" }}
            </em>
          </small>
          <button
            :disabled="!isSearchReadyToStart"
            :aria-busy="isSearchLoading"
            @click="onClickSearch"
            class="mt-1"
          >
            {{ isSearchLoading ? "" : "Rechercher..." }}
          </button>
        </label>
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
        v-if="
          Object.keys(journeysFiltered(showOnlyAvailableJourneys)).length === 0
        "
      >
        <article>Pas d'itinéraire disponible</article>
      </section>
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
import store, { UIStation } from "../store";
import {
  titleCaseGare,
  formatDate,
  humanizeDate,
  humanizeDateDiff,
} from "../utils";
import { APIv2QueryParams, Journey, UiJourney } from "@/models";
import JourneyElement from "./JourneyElement.vue";

export default defineComponent({
  name: "SearchComponent",
  components: {
    JourneyElement,
  },
  mounted() {
    store.dispatch("getDepartureStations").then(() => {
      this.isDepartureReady = true;
    });

    store.dispatch("getFavoriteStations");
    store.dispatch("getLastUpdateDataset");
  },
  data() {
    const departure: UIStation = {
      name: "",
      iata: "",
      favorite: false,
    };

    const arrival: UIStation = {
      name: "",
      iata: "",
      favorite: false,
    };

    return {
      isDepartureReady: false,
      isArrivalReady: false,
      isArrivalSelected: false,
      isSearchLoading: false,
      isSearchReadyToStart: false,
      isSearchReady: false,
      showOnlyAvailableJourneys: true,
      departure,
      arrival,
      from_date: formatDate(new Date()),
    };
  },
  computed: {
    ...mapGetters({
      departureStations: "getDepartureStations",
      departureStationsFavorites: "getDepartureStationsFavorites",
      departureStationsNotFavorite: "getDepartureStationsNotFavorite",
      arrivalStations: "getArrivalStations",
      arrivalStationsFavorites: "getArrivalStationsFavorites",
      arrivalStationsNotFavorite: "getArrivalStationsNotFavorite",
      journeys: "getJourneys",
      lastUpdateDataset: "getLastUpdateDataset",
    }),
    titleCaseGare: function () {
      return titleCaseGare;
    },
    humanizeDate: function () {
      return humanizeDate;
    },
    humanizeDateDiff: function () {
      return humanizeDateDiff;
    },
  },
  methods: {
    onChangeDeparture() {
      this.isArrivalReady = false;
      this.arrival = {
        name: "",
        iata: "",
        favorite: false
      };
      this.isSearchReadyToStart =
        this.departure.name != null && this.departure.name.trim() !== "";
      this.isArrivalSelected = false;
      store
        .dispatch("getArrivalStations", { departure: this.departure.name })
        .then(() => {
          this.isArrivalReady = true;
        });
    },
    onChangeArrival() {
      this.isArrivalSelected =
        this.arrival != null && this.arrival?.name?.trim() !== "";
    },
    onClickSearch() {
      this.isSearchLoading = true;
      this.isSearchReady = false;
      const refine = [`origine:${this.departure.name}`];
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
    journeysFiltered: (
      showOnlyAvailableJourneys: boolean
    ): { [key: string]: UiJourney[] } => {
      const groupByDays: { [key: string]: UiJourney[] } = {};
      const results: Journey[] =
        store.getters[
          showOnlyAvailableJourneys
            ? "getJourneysOnlyAvailables"
            : "getJourneys"
        ];
      results.forEach((journey) => {
        const date = journey.date.toString();
        if (!(date in groupByDays)) {
          groupByDays[date] = [];
        }
        groupByDays[date].push({ ...journey, selected: false });
      });
      return groupByDays;
    },
    handleFavorite: (station: UIStation) => {
      station.favorite = !station.favorite;
      if (station.favorite) {
        store.commit("addFavoriteStations", station);
      } else {
        store.commit("removeFavoriteStations", station);
      }
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
label {
  text-align: left;
}

.departure-grid {
  grid-template-columns: 10fr 1fr;
  grid-column-gap: 0.5em;
  display: grid;
}

.selected .star {
  fill: #f3e745;
  stroke: #374956;
}

#favorite_btn {
  margin-top: 0.25em;
}

.row-one-grid {
  @media (min-width: 50em) {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
  }
  display: grid;
}

.row-two-grid {
  @media (min-width: 50em) {
    grid-template-columns: 1.2fr 1fr;
    grid-column-gap: 1em;
  }
  display: grid;
}

.custom-label {
  @media (max-width: 50em) {
    margin-bottom: 1rem;
  }
}

.date {
  font-weight: 600;
}
</style>
