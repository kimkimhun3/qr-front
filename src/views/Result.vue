<template>
  <v-card
    class="mx-auto my-12"
    max-width="500"
  >
    <v-img
      height="350" :src="'https://drive.google.com/thumbnail?id=' + 
      $store.state.response['identityCard'].match(/^https:\/\/drive.google.com\/open\?id=(.*)/)[1]"
    ></v-img>

    <v-card-title>Participant Details: </v-card-title>
    <v-btn tile outlined class="ml-3" @click="transcriptDialog = true">
      <v-icon left>mdi-file-document-outline</v-icon>Transcript
    </v-btn>
        <v-btn tile outlined class="ml-3" @click="moreinfoDialog = true">
      <v-icon left>mdi-folder</v-icon>More Info
    </v-btn>
    
    <v-card-text>
      <v-list flat>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon >mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.response["name"] }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="mx-4"></v-divider>
      </v-list>

      <v-list flat>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon >mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.response["gender"] }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="mx-4"></v-divider>
      </v-list>

      
      <v-list flat>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon >mdi-school</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.response["major"] }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="mx-4"></v-divider>
      </v-list>
      <v-list flat>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon >mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.response["examDate"] }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="mx-4"></v-divider>
      </v-list>
      <v-list flat>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon >mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.response["examTime"] }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="mx-4"></v-divider>
      </v-list>

    </v-card-text>
    
    <v-card-text>
      <v-btn
        tile
        outlined
        @click="
          $router.push('/scanner');
          $store.commit('emptyResponse');
        "
      > 
        <v-icon left>mdi-arrow-left</v-icon>
        Back</v-btn
      >
      <v-btn tile outlined @click="onAttend()" class="ml-2" >
        <v-icon left>mdi-check</v-icon>
        Attended</v-btn>
    </v-card-text>
      <v-dialog v-model="imageDialog">
      <v-card>
        <v-card-title>Student Image</v-card-title>
        <v-card-text>
          <v-img
            :src="
              'https://drive.google.com/thumbnail?id=' +
                $store.state.response['identityCard'].match(
                  /^https:\/\/drive.google.com\/open\?id=(.*)/
                )[1]
            "
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn tile outlined @click="imageDialog = false">
            <v-icon left>mdi-close</v-icon>Close</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="transcriptDialog">
      <v-card>
        <v-card-title>Student Transcript</v-card-title>
        <v-card-text>
          <v-img
            :src="
              'https://drive.google.com/thumbnail?id=' +
                $store.state.response['transcript'].match(
                  /^https:\/\/drive.google.com\/open\?id=(.*)/
                )[1]  
            "
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn tile outlined @click="transcriptDialog = false">
            <v-icon left>mdi-close</v-icon>Close</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="attendDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>
          Status:
        </v-card-title>
        <v-card-text>
          {{ attendStatus }}
          <span v-if="response.attended"
            ><br />
            Tap <strong>Next</strong> to proceed to
            <strong>Scoring</strong> page.
            <br />
            Tap <strong>Back</strong> to go back to
            <strong>Scanner</strong> page.
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$router.push('/scanner')">Back</v-btn>
          <v-btn v-if="(attended = false)" text @click="attendDialog = false"
            >Close</v-btn
          >
          <v-btn v-else text @click="goToScoring()">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="moreinfoDialog" max-width="400" persistent>
      <v-card class="mx-auto" max-width="400" tile>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Name</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["name"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Email</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["email"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Major</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["major"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Date of Birth</v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate($store.state.response["dob"]) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Phone Number</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["phoneNumber"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Guardian Number</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["guardianNumber"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
            
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>School Location</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["schoolLocation"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Education Status</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["educationStatus"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line v-if="$store.state.response['currentGrade'] !== ''">
          <v-list-item-content>
            <v-list-item-title>Grade</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["currentGrade"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
            
        <v-list-item three-line v-if="$store.state.response['currentMajor'] !== ''">
          <v-list-item-content>
            <v-list-item-title>Current Major</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["currentMajor"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line v-if="$store.state.response['university'] !== ''">
          <v-list-item-content>
            <v-list-item-title>University</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["university"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line v-if="$store.state.response['school'] !== ''">
          <v-list-item-content>
            <v-list-item-title>School</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["school"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>BACCII Grade</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["baciiGrade"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>Math Grade</v-list-item-title>
            <v-list-item-subtitle>
              {{ $store.state.response["mathGrade"] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-spacer></v-spacer>
        <div class="text-center" >
          <v-btn tile outlined @click="moreinfoDialog = false">
            <v-icon>mdi-close</v-icon>Close
          </v-btn>
        </div> 
         <v-spacer></v-spacer>

      </v-card>
  </v-dialog>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

  </v-card>
</template>



<script>
import moment from "moment";
import axios from "axios";

export default {
  data: () => ({
    imageDialog: false,
    transcriptDialog: false,
    moreinfoDialog: false,
    response: {},
    loading: false,
    attendStatus: "",
    attendDialog: false,
  }),
  methods: {
    formatDate(date) {
      return moment(date).format("Do MMMM YYYY");
    },
    onAttend: function() {
      this.loading = true;
      this.response = { ...this.$store.state.response };
      delete this.response.id;
      this.response.attended = true;
      axios
        .put(
          "https://bruh-test-123.herokuapp.com/students/" +
            this.response.base64Code,
          this.response
        )
        .then((res) => {
          console.log(res);
          this.attendStatus = "Student have attended.";
          this.postStudent();
        })
        .catch((err) => {
          console.log(err);
          this.response.attended = false;
          this.attendStatus =
            "Student attendance is not recorded due to error.";
        })
        .finally(() => {
          this.loading = false;
          this.attendDialog = true;
        });
    },
    postStudent: function() {
      if (
        this.response.major ===
        "1 Software Engineering (Overall Grade D Can Apply)"
      ) {
        axios
          .post("https://bruh-test-123.herokuapp.com/se_students/", {
            email: this.response.email,
            name: this.response.name,
            attended: true,
            iqAttended: false,
            iqScore: 0,
            mathAttended: false,
            mathScore: 0,
            englishAttended: false,
            englishScore: 0,
            passed: false,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.response.major === "2 Tourism Management") {
        axios
          .post("https://bruh-test-123.herokuapp.com/tm_students/", {
            email: this.response.email,
            name: this.response.name,
            attended: true,
            iqAttended: false,
            iqScore: 0,
            englishAttended: false,
            englishScore: 0,
            passed: false,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        this.response.major === "3 Architect (Overall Grade D Can Apply)"
      ) {
        axios
          .post("https://bruh-test-123.herokuapp.com/au_students/", {
            email: this.response.email,
            name: this.response.name,
            attended: true,
            iqAttended: false,
            iqScore: 0,
            mathAttended: false,
            mathScore: 0,
            artAttended: false,
            artScore: 0,
            englishAttended: false,
            englishScore: 0,
            passed: false,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style></style>
