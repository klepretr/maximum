<template>
  <article :class="{ disable: !journey.available }">
    <div class="custom-grid">
      <div class="station">
        <span class="station_label">de</span>
        <span class="station_name">{{ titleCaseGare(journey.origin.label) }}</span>
      </div>
      <div></div>
      <div class="ta-e mr-3">
        {{ journey.available ? "disponible" : "indisponible" }}
        <a
          v-if="journey.available"
          v-on:click="moreInfo = !moreInfo"
          class="ml-1"
          :data-tooltip="moreInfo ? 'fermer' : '+ d\'infos'"
        >
          <sup v-if="!moreInfo">&#9432;</sup>
          <sup v-if="moreInfo">&#9746;</sup>
        </a>
      </div>
      <div class="spliter"></div>
      <div class="ta-e timesheet merge-col-ends">
        {{ humanizeDatetime(journey.departureDate) }} ➔ {{ humanizeDatetime(journey.arrivalDate) }}
      </div>
      <div class="station">
        <span class="station_label">vers</span>
        <span class="station_name">{{
          titleCaseGare(journey.destination.label)
        }}</span>
      </div>
      <div class="ta-e number merge-col-ends">
        {{ journey.trainEquipment }} n°<span style="font-weight: 600">{{ journey.trainNumber }}</span>
      </div>
    </div>
    <blockquote class="ta-l" v-if="moreInfo">
      La disponibilité de ce trajet
      <mark>peut ne pas être à jour</mark>.<br /><br />
      <small>
        La
        <a
          href="https://ressources.data.sncf.com/explore/dataset/tgvmax/information/"
        >
          source de données
        </a>
        qu'utilise cette application est mise à jour quotidiennement. Veuillez
        vérifier l'état réel du trajet depuis votre application de réservation.
      </small>
    </blockquote>
  </article>
</template>
<script lang="ts" src="./JourneyComponent.ts" />
<style lang="scss" scoped src="./JourneyComponent.scss" />