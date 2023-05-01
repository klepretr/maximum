<template>
  <section class="mb-3">
    <h4 class="ta-l">{{ $t("search.title") }}</h4>
    <form @submit="$event.preventDefault()">
      <div class="row-one-grid">
        <div class="departure-grid">
          <label for="from_stations">
            {{ $t("search.station.departure") }}
            <select
              @change="onChangeDeparture"
              :disabled="!isDepartureReady"
              :aria-busy="!isDepartureReady"
              v-model="departure"
              id="from_stations"
            >
              <option value="" disabled selected>
                {{ $t("search.station.departureOption") }}
              </option>
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
          {{ $t("search.station.arrival") }}
          <select
            @change="onChangeArrival()"
            :disabled="!isArrivalReady"
            v-model="arrival"
            id="to_stations"
          >
            <option value="" disabled selected>
              {{ $t("search.station.arrivalOption") }}
            </option>
            <optgroup v-if="arrivalStationsFavorites.length > 0">
              <option
                v-for="station in arrivalStationsFavorites"
                v-bind:key="station.name"
                :value="station"
              >
                {{ titleCaseGare(station.name) }}
              </option>
            </optgroup>
            <option
              v-for="station in arrivalStationsNotFavorite"
              v-bind:key="station.name"
              :value="station"
            >
              {{ titleCaseGare(station.name) }}
            </option>
          </select>
        </label>
      </div>
      <div class="row-two-grid mt-5">
        <label for="date">
          {{ $t("search.fromAt") }}
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
            {{ $t("search.lastUpdate.label") }}
            <em
              :data-tooltip="
                lastUpdateDataset ? lastUpdateDataset.format('LLL') : null
              "
            >
              {{
                humanizeDateDiff(lastUpdateDataset) ||
                $t("search.lastUpdate.notAvailable")
              }}
            </em>
          </small>
          <button
            :disabled="!isSearchReadyToStart"
            :aria-busy="isSearchLoading"
            @click="onClickSearch"
            class="mt-1"
          >
            {{ isSearchLoading ? "" : $t("search.station.startSearch") }}
          </button>
        </label>
      </div>
    </form>
  </section>
  <!-- Switch -->
  <section id="results">
    <article v-if="isSearchLoading">
      <progress></progress>
      {{ $t("search.station.startSearch") }}
    </article>
    <div v-if="isSearchReady">
      <fieldset v-if="false">
        <label for="switch">
          <!-- disabled feature temporary -->
          <input
            type="checkbox"
            id="switch"
            name="switch"
            role="switch"
            v-model="showOnlyAvailableJourneys"
          />
          {{ $t("result.showNotAvailableJourneys") }}
        </label>
      </fieldset>
      <section
        v-if="
          Object.keys(journeysFiltered(showOnlyAvailableJourneys)).length === 0
        "
      >
        <article>{{ $t("result.noJourneyAvailable") }}</article>
      </section>
      <section
        v-for="(journeys, date) in journeysFiltered(showOnlyAvailableJourneys)"
        :key="date"
      >
        <div class="ml-5 ta-l date" v-if="journeys.length > 0">
          {{ humanizeDate(date) }}
        </div>
        <JourneyComponent
          v-for="journey in journeys"
          v-bind:key="journey.id"
          :journey="journey"
        ></JourneyComponent>
      </section>
    </div>
  </section>
</template>

<script lang="ts" src="./SearchFormComponent.ts" />

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./SearchFormComponent.scss" />
