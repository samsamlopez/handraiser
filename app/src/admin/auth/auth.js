import React, { Component } from "react";
import AuthService from "./services";
import decode from "jwt-decode";

import api from "../services/fetchApi";

export default function Auth(AuthComponent) {
  const Auth = new AuthService();

  return class AuthWrapped extends Component {
    state = {
      confirm: null,
      loaded: false
    };

    componentDidMount() {
      if (Auth.getToken() !== null) {
        const decodedToken = decode(Auth.getToken());
        if (decodedToken.adminId !== undefined) {
          api
            .fetch(`/admin/details/${decodedToken.adminId}`, "get")
            .then(res => {
              if (res.data.admin[0].password === "Admin123") {
                window.location.href = "/admin/default";
              } else {
                if (!Auth.loggedIn()) {
                  window.location.href = "/admin/sign-in";
                } else {
                  try {
                    const confirm = Auth.getConfirm();
                    this.setState({
                      confirm: confirm,
                      loaded: true
                    });
                  } catch (err) {
                    Auth.logout();
                    window.location.href = "/admin/sign-in";
                  }
                }
              }
            });
        } else {
          window.location.href = "/404";
        }
      } else {
        if (!Auth.loggedIn()) {
          window.location.href = "/admin/sign-in";
        } else {
          try {
            const confirm = Auth.getConfirm();
            this.setState({
              confirm: confirm,
              loaded: true
            });
          } catch (err) {
            Auth.logout();
            window.location.href = "/admin/sign-in";
          }
        }
      }
    }

    render() {
      if (!this.state.loaded || !this.state.confirm) {
        return null;
      }
      return <AuthComponent />;
    }
  };
}
