import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/caseList",
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
  },
  {
    path: "/caseList",
    component: () => import("@/views/caseList"),
  },
  {
    path: "/monitor",
    component: () => import("@/views/monitor/index"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
