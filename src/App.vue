<template>
  <v-app>
    <v-main :class="$route.name === 'Home' ? 'primary' : 'white'">
      <v-app-bar v-if="$route.name !== 'Home'" app color="primary">
        <v-spacer></v-spacer>
        <v-btn @click="signOut()" tile outlined dark>
          <v-icon left>mdi-exit-to-app</v-icon>
          Sign out</v-btn
        >
      </v-app-bar>
      <v-container fill-height fluid>
        <v-row justify="center">
          <v-col align="center">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="$store.state.warningDialog" width="400">
        <v-card>
          <v-card-title>Warning!</v-card-title>
          <v-card-text>
            {{ $store.state.message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="$store.commit('toggleDialogOff')">
              I understand.
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  name: "App",
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          console.log("Signed out.");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },

  data: () => ({
    //
  }),
};
</script>
