import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
// import defAva from "@/assets/images/profile.jpg";
import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    id: "",
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(username, password) {
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((res) => {
            setToken(res?.access_token);
            this.token = res?.access_token;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((RES) => {
            let res = RES.data;
            const user = res.user;
            const avatar =
              user.avatar == "" || user.avatar == null
                ? ""
                : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles;
              this.permissions = res.permissions;
            } else {
              this.roles = ["ROLE_DEFAULT"];
            }
            this.id = user.userId;
            this.name = user.userName;
            this.avatar = avatar;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export default useUserStore;
