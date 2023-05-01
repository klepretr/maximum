<template>
  <article v-if="journey" :class="{ disable: !journey.available }">
    <div class="custom-grid">
      <div class="station">
        <span class="station_label">{{ $t("result.from") }}</span>
        <span class="station_name">{{
          titleCaseGare(journey.origin.label)
        }}</span>
      </div>
      <div></div>
      <div class="ta-e mr-3">
        {{
          journey.available ? $t("result.available") : $t("result.notAvailable")
        }}
        <a
          v-if="journey.available"
          v-on:click="moreInfo = !moreInfo"
          class="ml-1"
          :data-tooltip="
            moreInfo
              ? $t('result.tooltip.close')
              : $t('result.tooltip.moreInfo')
          "
        >
          <sup v-if="!moreInfo">&#9432;</sup>
          <sup v-if="moreInfo">&#9746;</sup>
        </a>
      </div>
      <div class="spliter"></div>
      <div class="ta-e timesheet merge-col-ends">
        {{ humanizeDatetime(journey.departureDate) }} ➔
        {{ humanizeDatetime(journey.arrivalDate) }}
      </div>
      <div class="station">
        <span class="station_label">{{ $t("result.to") }}</span>
        <span class="station_name">{{
          titleCaseGare(journey.destination.label)
        }}</span>
      </div>
      <div class="ta-e number merge-col-ends">
        {{ journey.trainEquipment }} n°<span style="font-weight: 600">{{
          journey.trainNumber
        }}</span>
      </div>
    </div>
    <blockquote class="ta-l" v-if="moreInfo">
      {{ $t("result.moreInfo.prefix") }}
      <mark>{{ $t("result.moreInfo.highlight") }}</mark
      >{{ $t("result.moreInfo.suffix") }}<br /><br />
      <small>
        {{ $t("result.moreInfo.smallPrefix") }}
        <a
          href="https://ressources.data.sncf.com/explore/dataset/tgvmax/information/"
        >
          {{ $t("result.moreInfo.smallLink") }}
        </a>
        {{ $t("result.moreInfo.smallSuffix") }}
      </small>
    </blockquote>
  </article>
</template>
<script lang="ts" src="./JourneyComponent.ts" />
<style lang="scss" scoped src="./JourneyComponent.scss" />
