<template>
  <div>
    <v-card width="400" tile class="py-12" flat>
      <v-card-text v-if="error">
        {{ error }}
      </v-card-text>
      <v-card-text>
        <qrcode-stream @decode="onDecode" @init="onInit" />
      </v-card-text>
    </v-card>
    <v-dialog v-model="resultDialog" width="400" persistent>
      <v-card>
        <v-card-title>Result: </v-card-title>
        <v-card-text>
          {{ response }}
          <br />
          Tap <strong>Back</strong> to go back to <strong>Scanner</strong> page.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$router.go()">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="attendDialog" width="400" persistent>
      <v-card>
        <v-card-title>
          Status:
        </v-card-title>
        <v-card-text>
          {{ attendStatus }}
          <br />
          Tap <strong>Back</strong> to go back to <strong>Scanner</strong> page.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="$router.go()">
            Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="haveAttended" persistent>
      <v-card>
        <v-card-title>Status:</v-card-title>
        <v-card-text
          >Student have already attended. <br />
          Tap <strong>Next</strong> to proceed to <strong>Scoring</strong> page.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$router.go()">Back</v-btn>
          <v-btn text @click="findScores()">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import axios from "axios";

export default {
  data: () => ({
    result: "",
    error: "",
    resultDialog: false,
    response: "",
    isError: false,
    loading: false,
    attendStatus: "",
    attendDialog: false,
    haveAttended: false,
  }),
  components: {
    QrcodeStream,
  },
  methods: {
    onDecode: function(result) {
      this.result = result;
      this.onSearch();
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
    onSearch: function() {
      this.loading = true;
      var attended = false;
      axios
        .get("https://bruh-test-123.herokuapp.com/students/" + this.result)
        .then((res) => {
          this.response = res.data;
          this.$store.commit("getResponse", this.response);
          if (this.response["attended"]) {
            attended = true;
          } else {
            this.$router.push("/result");
          }
          this.isError = false;
        })
        .catch((err) => {
          console.log(err);
          this.response = "Warning: Invalid QR Code";
          this.isError = true;
        })
        .finally(() => {
          this.loading = false;
          if (attended) {
            this.haveAttended = true;
          } else {
            this.resultDialog = true;
          }
        });
    },
    findScores: function() {
      this.loading = true;
      this.haveAttended = false;
      var link = "";
      if (
        this.$store.state.response.major ===
        "1 Software Engineering (Overall Grade D Can Apply)"
      ) {
        link = "se_students/";
      } else if (this.$store.state.response.major === "2 Tourism Management") {
        link = "tm_students/";
      } else if (
        this.$store.state.response.major ===
        "3 Architect (Overall Grade D Can Apply)"
      ) {
        link = "au_students/";
      }
      axios
        .get(
          "https://bruh-test-123.herokuapp.com/" +
            link +
            this.$store.state.response.email
        )
        .then((res) => {
          this.$store.commit("getScores", res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
          this.$router.push("/scoring");
        });
    },
  },
  mounted() {
    console.log();
  },
};
</script>

<style></style>
