import router from "./router";
import { getToken } from "@/utils/auth";

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  // NProgress.start();
  if (getToken()) {
    //存在token，如果地址还是login的地址，则自动跳到项目首页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
  }
});

router.afterEach(() => {});
