import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    warningDialog: false,
    message: "",
    response: {},
    scores: {},
    major: "",
  },
  mutations: {
    toggleDialogOn(state, message) {
      state.warningDialog = true;
      state.message = message;
    },
    toggleDialogOff(state) {
      state.warningDialog = false;
      state.message = "";
    },
    getResponse(state, response) {
      state.response = response;
    },
    emptyResponse(state) {
      state.response = {};
    },
    getScores(state, scores) {
      state.scores = scores;
    },
    emptyScores(state) {
      state.scores = {};
    },
    getMajor(state, major) {
      state.major = major;
    },
  },
  actions: {},
  modules: {},
});
