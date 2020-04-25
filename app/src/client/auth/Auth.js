import React, { Component } from "react";
import AuthService from "./AuthService";
import decode from "jwt-decode";

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
        if (decodedToken.sub !== undefined) {
          if (!Auth.loggedIn()) {
            window.location.href = "/sign-in";
          } else {
            try {
              const confirm = Auth.getConfirm();
              this.setState({
                confirm: confirm,
                loaded: true
              });
            } catch (err) {
              Auth.logout();
              window.location.href = "/sign-in";
            }
          }
        } else {
          window.location.href = "/404";
        }
      } else {
        if (!Auth.loggedIn()) {
          window.location.href = "/sign-in";
        } else {
          try {
            const confirm = Auth.getConfirm();
            this.setState({
              confirm: confirm,
              loaded: true
            });
          } catch (err) {
            Auth.logout();
            window.location.href = "/sign-in";
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
