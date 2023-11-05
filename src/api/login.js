import request from "@/utils/request";

// 登录方法
export function login(username, password) {
  const data = {
    username,
    password,
    grant_type: "password",
  };
  return request({
    url: "/jhcloud-portal/auth/login",
    headers: {
      // isToken: false,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Basic V2VDaGF0OjEyMzQ1Ng==",
    },
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/sys/user/getUserInfo",
    method: "post",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/sys/user/logout",
    method: "post",
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20000,
  });
}
