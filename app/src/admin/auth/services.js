import decode from "jwt-decode";

export default class AuthService {
  login = (username, password) => {
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

  loggedIn = () => {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  setToken = idToken => {
    localStorage.setItem("id_token", idToken);
  };

  getToken = () => {
    try {
      return localStorage.getItem("id_token");
    } catch (err) {
      return (window.location.href = "/admin/sign-in");
    }
  };

  logout = () => {
    localStorage.removeItem("id_token");
    window.location.href = "/admin/sign-in";
  };

  getConfirm = () => {
    let answer = decode(this.getToken());
    return answer;
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

  getDecodedToken = () => {
    try {
      return decode(localStorage.getItem("id_token"));
    } catch (err) {
      return (window.location.href = "/");
    }
  };
}
