import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import axios from "axios";
import {
  AggregationsResponse,
  APIv2QueryParams,
  DatasetInfoResponse,
  IAPIExplorerRequest,
  IAPIExplorerResponse,
  Journey,
} from "@/models";
import QueryString from "qs";
import dayjs from "dayjs";

type APIv2Endpoints = "aggregates" | "records";

const BASE_URL_EXPLORER =
  "https://ar0g2l6n89.execute-api.eu-west-3.amazonaws.com/api/public/refdata/";
const DATASET_URL_EXPLORER = BASE_URL_EXPLORER + "search-freeplaces-proposals";

const BASE_URL = "https://ressources.data.sncf.com/api/";
const DATASET_URL_V2 = (
  dataset: string,
  endpoint: APIv2Endpoints | null = "aggregates"
): string =>
  BASE_URL + `v2/catalog/datasets/${dataset}${endpoint ? "/" + endpoint : ""}`;

const DATASET_IDENTIFIER = "tgvmax";
const TZ_IDENTIFIER = "Europe/Paris";

const DEFAULT_V2_QUERY_PARAM: APIv2QueryParams = {
  limit: 1000,
  offset: 0,
};

const xios = axios.create({
  paramsSerializer: (params) =>
    QueryString.stringify(params, { arrayFormat: "repeat" }),
  timeout: 3000,
});

export const ESCAPE_CAPITALIZE_WORDS = [
  { value: "TGV", force: true },
  { value: "SNCF", force: true },
  { value: "le", force: false },
  { value: "la", force: false },
  { value: "sur", force: false },
  { value: "de", force: false },
  { value: "des", force: false },
  { value: "CDG2", force: true },
  { value: "et", force: false },
  { value: "en", force: false },
  { value: "les", force: false },
];

interface StationDesc {
  name: string;
  iata: string;
}

const mergeStationsAndFavorites = (
  stations: StationDesc[],
  favorites: StationDesc[]
): UIStation[] => {
  return stations.map((station) => {
    return {
      ...station,
      favorite: !!favorites.find((fav) => fav.iata == station.iata),
    };
  });
};

const saveFavorites = (favoriteStations: StationDesc[]) => {
  if (localStorage) {
    localStorage.setItem("favoriteStations", JSON.stringify(favoriteStations));
  }
};

const extractGaresFromAggregations = (
  data: AggregationsResponse
): StationDesc[] => {
  return data.aggregations.map((aggr) => {
    if (aggr.origine && aggr.origine_iata) {
      return {
        iata: aggr.origine_iata,
        name: aggr.origine,
      };
    }
    if (aggr.destination && aggr.destination_iata) {
      return {
        iata: aggr.destination_iata,
        name: aggr.destination,
      };
    }

    return {
      iata: "XXXX",
      name: "Station Not Found",
    };
  });
};

const extractJourneysFromResponse = (data: IAPIExplorerResponse): Journey[] => {
  if(!data.proposals) {
    return [];
  }

  return data.proposals.map((r) => {
    return {
      ...r,
      available: r.freePlaces > 0,
      id: `${r.trainNumber}${r.departureDate}${r.origin.rrCode}`,
    };
  });
};

const extractLastUpdateFromDatasetInfo = (
  data: DatasetInfoResponse
): dayjs.Dayjs => {
  return dayjs(data?.dataset?.metas?.default?.data_processed) || null;
};

export interface UIStation extends StationDesc {
  favorite: boolean;
}

export interface State {
  departureStations: UIStation[];
  arrivalStations: UIStation[];
  favoriteStations: StationDesc[];
  journeys: Journey[];
  lastUpdateDataset: dayjs.Dayjs | null;
}

export const key: InjectionKey<Store<State>> = Symbol();

export function useStore(): Store<State> {
  return baseUseStore(key);
}

export default createStore<State>({
  state: {
    departureStations: [],
    arrivalStations: [],
    favoriteStations: [],
    journeys: [],
    lastUpdateDataset: null,
  },
  getters: {
    getDepartureStations: (state) => state.departureStations,
    getDepartureStationsFavorites: (state) =>
      state.departureStations.filter((station) => station.favorite),
    getDepartureStationsNotFavorite: (state) =>
      state.departureStations.filter((station) => !station.favorite),
    getArrivalStations: (state) => state.arrivalStations,
    getArrivalStationsFavorites: (state) =>
      state.arrivalStations.filter((station) => station.favorite),
    getArrivalStationsNotFavorite: (state) =>
      state.arrivalStations.filter((station) => !station.favorite),
    getFavoriteStations: (state) => state.favoriteStations,
    getJourneys: (state) => state.journeys,
    getJourneysOnlyAvailables: (state) =>
      state.journeys.filter((journey: Journey) => journey.available),
    getLastUpdateDataset: (state) => state.lastUpdateDataset,
  },
  mutations: {
    setDepartureStations(state, departureStations) {
      if (localStorage) {
        localStorage.setItem(
          "departureStations",
          JSON.stringify(departureStations)
        );
      }
      state.departureStations = departureStations;
    },
    setArrivalStations(state, arrivalStations) {
      state.arrivalStations = arrivalStations;
    },
    setLastUpdateDataset(state, lastUpdateDataset) {
      state.lastUpdateDataset = lastUpdateDataset;
    },
    addFavoriteStations(state, station) {
      state.favoriteStations.push(station);
      saveFavorites(state.favoriteStations);
    },
    removeFavoriteStations(state, station) {
      if (state.favoriteStations.includes(station)) {
        state.favoriteStations.splice(
          state.favoriteStations.indexOf(station),
          1
        );
      }
      saveFavorites(state.favoriteStations);
    },
    setFavoriteStations(state, favoriteStations) {
      state.favoriteStations = favoriteStations;
    },
    setJourneys(state, journeys) {
      state.journeys = journeys;
    },
  },
  actions: {
    getLastUpdateDataset(
      { commit },
      parameters: APIv2QueryParams = {
        ...DEFAULT_V2_QUERY_PARAM,
        timezone: TZ_IDENTIFIER,
      }
    ) {
      return xios
        .get(DATASET_URL_V2(DATASET_IDENTIFIER, null), {
          params: { ...DEFAULT_V2_QUERY_PARAM, ...parameters },
        })
        .then((res) =>
          commit(
            "setLastUpdateDataset",
            extractLastUpdateFromDatasetInfo(res.data)
          )
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
            // Use localStorage if possible as fallback
            console.error("Network error, no fallback");
          }
        });
    },
    getDepartureStations(
      { getters, commit },
      parameters: APIv2QueryParams = {
        ...DEFAULT_V2_QUERY_PARAM,
        group_by: "origine,origine_iata",
      }
    ) {
      return xios
        .get(DATASET_URL_V2(DATASET_IDENTIFIER), {
          params: { ...DEFAULT_V2_QUERY_PARAM, ...parameters },
        })
        .then((res) =>
          commit(
            "setDepartureStations",
            mergeStationsAndFavorites(
              extractGaresFromAggregations(res.data),
              getters.getFavoriteStations
            )
          )
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
            // Use localStorage if possible as fallback
            console.error(
              "Network error, use localStorage if possible as fallback"
            );
            if (localStorage && localStorage.getItem("departureStations")) {
              const departureStations =
                localStorage.getItem("departureStations");
              if (departureStations) {
                commit(
                  "setDepartureStations",
                  mergeStationsAndFavorites(
                    JSON.parse(departureStations),
                    getters.getFavoriteStations
                  )
                );
              }
            }
          }
        });
    },
    getArrivalStations(
      { getters, commit },
      parameters: { query: APIv2QueryParams; departure: string } = {
        query: DEFAULT_V2_QUERY_PARAM,
        departure: "",
      }
    ) {
      return xios
        .get(DATASET_URL_V2(DATASET_IDENTIFIER), {
          params: {
            ...DEFAULT_V2_QUERY_PARAM,
            ...parameters.query,
            group_by: "destination,destination_iata",
            refine: `origine:${parameters.departure}`,
          },
        })
        .then((res) =>
          commit(
            "setArrivalStations",
            mergeStationsAndFavorites(
              extractGaresFromAggregations(res.data),
              getters.getFavoriteStations
            )
          )
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
            // Use departureStation as fallback
            console.error("Network error, use departureStation as fallback");
            commit(
              "setArrivalStations",
              mergeStationsAndFavorites(
                getters.getDepartureStations,
                getters.getFavoriteStations
              )
            );
          }
        });
    },
    getFavoriteStations({ commit }) {
      if (localStorage && localStorage.getItem("favoriteStations")) {
        const favoriteStations = localStorage.getItem("favoriteStations");
        if (favoriteStations) {
          commit("setFavoriteStations", JSON.parse(favoriteStations));
          return;
        }
      }
      commit("setFavoriteStations", []);
    },
    getJourneys({ commit }, request: IAPIExplorerRequest) {
      return xios
        .get(DATASET_URL_EXPLORER, { params: { ...request } })
        .then((res) =>
          commit("setJourneys", extractJourneysFromResponse(res.data))
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
          } else {
            commit("setJourneys", []);
          }
        });
    },
  },
  modules: {},
});
