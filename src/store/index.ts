import { createStore } from "vuex";
import axios from "axios";
import {
  AggregationsResponse,
  APIv2QueryParams,
  Journey,
  RecordsResponse,
} from "@/models";
import QueryString from "qs";

type APIv2Endpoints = "aggregates" | "records";

const BASE_URL = "https://ressources.data.sncf.com/api/";
const DATASET_URL_V2 = (
  dataset: string,
  endpoint: APIv2Endpoints = "aggregates"
): string => BASE_URL + `v2/catalog/datasets/${dataset}/${endpoint}`;

const DATASET_IDENTIFIER = "tgvmax";

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

const extractGaresFromAggregations = (data: AggregationsResponse): string[] => {
  return data.aggregations.map((aggr) => {
    return aggr.origine || aggr.destination || "Station Name not found";
  });
};

const extractJourneysFromRecord = (data: RecordsResponse): Journey[] => {
  return data.records.map((r) => {
    return {
      ...r.record.fields,
      available: r.record.fields.od_happy_card === "OUI" ? true : false,
      id: `${r.record.fields.train_no}${r.record.fields.date}${r.record.fields.origine_iata}`,
    };
  });
};

export default createStore({
  state: {
    departureStations: [],
    arrivalStations: [],
    journeys: [],
  },
  getters: {
    getDepartureStations: (state) => state.departureStations,
    getArrivalStations: (state) => state.arrivalStations,
    getJourneys: (state) => state.journeys,
    getJourneysOnlyAvailables: (state) =>
      state.journeys.filter((journey: Journey) => journey.available),
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
    setJourneys(state, journeys) {
      state.journeys = journeys;
    },
  },
  actions: {
    getDepartureStations(
      { commit },
      parameters: APIv2QueryParams = {
        ...DEFAULT_V2_QUERY_PARAM,
        group_by: "origine",
      }
    ) {
      return xios
        .get(DATASET_URL_V2(DATASET_IDENTIFIER), {
          params: { ...DEFAULT_V2_QUERY_PARAM, ...parameters },
        })
        .then((res) =>
          commit("setDepartureStations", extractGaresFromAggregations(res.data))
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
                commit("setDepartureStations", JSON.parse(departureStations));
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
            group_by: "destination",
            refine: `origine:${parameters.departure}`,
          },
        })
        .then((res) =>
          commit("setArrivalStations", extractGaresFromAggregations(res.data))
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
            // Use departureStation as fallback
            console.error("Network error, use departureStation as fallback");
            commit("setArrivalStations", getters.getDepartureStations);
          }
        });
    },
    getJourneys(
      { commit },
      parameters: APIv2QueryParams = DEFAULT_V2_QUERY_PARAM
    ) {
      return xios
        .get(DATASET_URL_V2(DATASET_IDENTIFIER, "records"), {
          params: { ...DEFAULT_V2_QUERY_PARAM, ...parameters },
        })
        .then((res) =>
          commit("setJourneys", extractJourneysFromRecord(res.data))
        )
        .catch((err) => {
          if (!err.status) {
            // Network error
            // Use departureStation as fallback
          }
        });
    },
  },
  modules: {},
});
