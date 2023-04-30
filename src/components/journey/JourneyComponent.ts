import { defineComponent } from "@vue/runtime-core";
import { humanizeDatetime, titleCaseGare } from "@/utils";

export default defineComponent({
  name: "JourneyComponent",
  props: {
    journey: Object,
  },
  data() {
    return {
      journey: {},
      selected: this.journey?.selected || false,
      moreInfo: false,
    };
  },
  computed: {
    titleCaseGare: function () {
      return titleCaseGare;
    },
    humanizeDatetime: function () {
      return humanizeDatetime;
    },
  },
});
