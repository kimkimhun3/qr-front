import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Scanner from "../views/Scanner.vue";
import Result from "../views/Result.vue";
import Scoring from "../views/Scoring.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/scanner",
    name: "Scanner",
    component: Scanner,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/result",
    name: "Result",
    component: Result,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/scoring",
    name: "Scoring",
    component: Scoring,
    meta: {
      requiresAuth: true,
    },
  },
  { path: "*", redirect: "/" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
