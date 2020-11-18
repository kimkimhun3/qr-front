import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";

import { config } from "./helpers/firebase.js";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  created() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.$router.push("/scanner");
      } else {
        this.$router.push("/");
      }
    });
  },
  render: (h) => h(App),
}).$mount("#app");
