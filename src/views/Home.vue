<template>
  <div class="home">
    <v-card width="400" class="py-12" flat tile>
      <v-card-text class="mb-6">
        <v-img src="https://i.imgur.com/0D8Yrza.png" width="150"></v-img>
      </v-card-text>
      <v-card-text>
        <v-btn @click="signInWithGoogle" outlined color="primary" class="px-6">
          <v-icon left>mdi-google</v-icon>Sign in with Google</v-btn
        >
      </v-card-text>
    </v-card>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";

export default {
  name: "Home",
  data: () => ({
    loading: false,
    dialog: false,
    message: "",
  }),
  components: {},
  methods: {
    signInWithGoogle: function() {
      this.loading = true;
      var provider = new firebase.auth.GoogleAuthProvider();
      var email = "";
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          email = result.user.email;
          if (email.match(/@kit.edu.kh\s*$/)) {
            console.log(email);
          } else {
            throw new Error(
              "This app is authorized for kit.edu.kh accounts only."
            );
          }
        })
        .catch((error) => {
          this.$store.commit("toggleDialogOn", error.message);
          firebase
            .auth()
            .signOut()
            .then(() => {
              console.log("Signed out.");
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
  },
};
</script>
