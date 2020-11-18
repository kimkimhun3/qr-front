<template>
  <div>
    <v-card tile outlined class="py-2">
      <v-card-text class="title text--primary">
        Participant Scores:
      </v-card-text>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="$store.state.scores.email"
              label="Email"
              disabled
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="$store.state.scores.name"
              label="Name"
              disabled
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            Attended:
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              inset
              disabled
              v-model="$store.state.scores.attended"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            IQ Attended:
          </v-list-item-content>
          <v-list-item-action>
            <v-switch inset v-model="$store.state.scores.iqAttended"></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              @input="passChecker()"
              type="number"
              v-model="$store.state.scores.iqScore"
              label="IQ Score"
              :disabled="!$store.state.scores.iqAttended"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$store.state.scores.hasOwnProperty('mathAttended')">
          <v-list-item-content>
            Math Attended:
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              inset
              v-model="$store.state.scores.mathAttended"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="$store.state.scores.hasOwnProperty('mathScore')">
          <v-list-item-content>
            <v-text-field
              @change="passChecker()"
              type="number"
              v-model="$store.state.scores.mathScore"
              label="Math Score"
              :disabled="!$store.state.scores.mathAttended"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$store.state.scores.hasOwnProperty('artAttended')">
          <v-list-item-content>
            Art Attended:
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              inset
              v-model="$store.state.scores.artAttended"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="$store.state.scores.hasOwnProperty('artScore')">
          <v-list-item-content>
            <v-text-field
              @change="passChecker()"
              type="number"
              v-model="$store.state.scores.artScore"
              label="Art Score"
              :disabled="!$store.state.scores.artAttended"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$store.state.scores.hasOwnProperty('englishAttended')"
        >
          <v-list-item-content>
            English Attended:
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              inset
              v-model="$store.state.scores.englishAttended"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="$store.state.scores.hasOwnProperty('englishScore')">
          <v-list-item-content>
            <v-text-field
              @change="passChecker()"
              type="number"
              v-model="$store.state.scores.englishScore"
              label="English Score"
              :disabled="!$store.state.scores.englishAttended"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            Passed:
          </v-list-item-content>
          <v-list-item-action>
            <strong>
              {{ status }}
            </strong>
          </v-list-item-action>
        </v-list-item>
        {{ response }}
      </v-card-text>
      <v-card-text>
        <v-btn tile outlined @click="$router.push('/scanner')"
          ><v-icon left>mdi-arrow-left</v-icon>Back</v-btn
        >
        <v-btn tile outlined class="ml-2" @click="postScore()">
          <v-icon left :disabled="status === 'Failed'">mdi-check</v-icon
          ><strong>Submit</strong></v-btn
        >
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          Status:
        </v-card-title>
        <v-card-text>
          {{ response }}
          <br />
          Tap <strong>Back</strong> to go back to <strong>Scanner</strong> page.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$router.push('/scanner')">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    scores: {},
    status: "",
    response: "",
    dialog: false,
    loading: false,
  }),
  methods: {
    onBack() {},
    passChecker() {
      if (this.$store.state.scores.iqScore === 0) {
        this.status = "Pending";
      } else if (
        this.$store.state.scores.iqScore <= 15 &&
        this.$store.state.scores.iqScore !== 0
      ) {
        this.status = "Failed";
      } else if (
        this.$store.state.scores.mathScore <= 50 &&
        this.$store.state.scores.mathScore !== 0
      ) {
        this.status = "Failed";
      } else if (
        this.$store.state.scores.englishScore <= 25 &&
        this.$store.state.scores.englishScore !== 0
      ) {
        this.status = "Failed";
      } else if (
        this.$store.state.scores.iqScore > 15 &&
        this.$store.state.scores.mathScore > 50 &&
        this.$store.state.scores.englishScore > 25
      ) {
        this.status = "Passed";
      } else {
        this.status = "Pending";
      }
    },
    postScore: function() {
      this.loading = true;
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
      var scores = { ...this.$store.state.scores };
      delete scores.id;
      if (this.status === "Passed") {
        scores.passed = true;
      } else {
        scores.passed = false;
      }
      axios
        .put(
          "https://bruh-test-123.herokuapp.com/" + link + scores.email,
          scores
        )
        .then((res) => {
          console.log(res);
          this.response = "Score have been successfully submitted.";
        })
        .catch((err) => {
          console.log(err);
          this.response = "An error have occurred.";
        })
        .finally(() => {
          console.log("Bruh");
          this.dialog = true;
          this.loading = false;
        });
    },
  },
  mounted: function() {
    this.passChecker();
  },
};
</script>

<style></style>
