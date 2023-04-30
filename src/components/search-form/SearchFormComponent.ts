import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import store, { UIStation } from "@/store";
import {
  titleCaseGare,
  formatDate,
  humanizeDate,
  humanizeDateDiff,
} from "@/utils";
import { IAPIExplorerRequest, Journey, UiJourney } from "@/models";
import JourneyComponent from "../journey/JourneyComponent.vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "SearchComponent",
  components: {
    JourneyComponent,
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
        favorite: false,
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
      const parameters: IAPIExplorerRequest = {
        departureDateTime: new Date(this.from_date),
        destination: this.arrival.iata,
        origin: this.departure.iata,
      };
      store.dispatch("getJourneys", parameters).then(() => {
        this.isSearchLoading = false;
        this.isSearchReady = true;
        const elem = document.querySelector("#results");
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
        const date = dayjs(journey.departureDate).startOf("day").toString();
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
