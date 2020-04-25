import React, { Component } from "react";
import AuthService from "./services";
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
        if (decodedToken.adminId === undefined) {
          window.location.href = "/404";
        } else {
          this.setState({
            confirm: true,
            loaded: true
          });
        }
      } else {
        window.location.href = "/404";
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
