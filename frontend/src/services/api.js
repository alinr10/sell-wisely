import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/",
});

instance.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (!auth) return config;
  const parsed = JSON.parse(auth);
  config.headers["x-access-token"] = parsed?.token;
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status && error.response) {

      localStorage.clear();
      window.location.href = "/";
    } else {
      return Promise.reject(error);
    }
  }
);

// eslint-disable-next-line
export default {
  user: {
    async login(email, password) {
      const response = await instance.post("/user/login", { email, password });
      return response.data;
    },
    async register(type, payload) {
      const url =
        type === "individual"
          ? "user/personal/register"
          : "user/company/register";
      const response = await instance.post(url, payload);
      return response.data;
    },

    async changePassword(payload) {
      const response = await instance.post("/user/changePassword", payload);
      return response.data;
    },
  }
};

