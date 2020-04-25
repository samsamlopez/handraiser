import decode from "jwt-decode";
import api from "../services/fetchApi";

export default class AuthService {
  login = (username, password) => {
    console.log(username + " " + password);
    return this.fetch(`/admin-sign-in`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  };

  fetch = (url, options) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    }).then(response => response.json());
  };

  setToken = idToken => {
    localStorage.setItem("id_token", idToken);
  };

  loggedIn = () => {
    const token = this.getToken();
    return !!token;
  };

  logout = () => {
    localStorage.removeItem("id_token");
    window.location.href = "/sign-in";
  };

  getConfirm = () => {
    try {
      let answer = decode(this.getToken());
      return answer;
    } catch (err) {
      return (window.location.href = "/");
    }
  };

  getToken = () => {
    try {
      return localStorage.getItem("id_token");
    } catch (err) {
      return (window.location.href = "/sign-in");
    }
  };

  getDecodedToken = () => {
    try {
      return decode(localStorage.getItem("id_token"));
    } catch (err) {
      return (window.location.href = "/");
    }
  };

  getFetchedTokenAPI = () => {
    try {
      let user = decode(localStorage.getItem("id_token"));
      return api.fetch(`/api/users/${user.sub}`, "get");
    } catch (err) {
      return (window.location.href = "/");
    }
  };
}
