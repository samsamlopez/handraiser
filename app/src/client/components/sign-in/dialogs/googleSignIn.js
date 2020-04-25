import React, { Component } from "react";
import decode from "jwt-decode";

import GoogleLogin from "react-google-login";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";

import api from "../../../services/fetchApi";
import io from "socket.io-client";

const socket = io("http://boom-handraiser.com:3001/");

const styles = {
  dialogContent: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5%"
  }
};

export default class googleSignIn extends Component {
  responseGoogleMentor = google => {
    if(google.expectedDomain === 'boom.camp') {
      toast.error("Sorry, invalid email!", {
        hideProgressBar: true,
        draggable: false
      });
    } else {
      const token = google.tokenId;
      const user = decode(google.tokenId);
      const data = {
        key: this.props.validatedKey,
        first_name: user.given_name,
        last_name: user.family_name,
        sub: user.sub,
        privilege: "mentor",
        avatar: user.picture
      };

      api.fetch("/sign-in", "post", data).then(res => {
        if (res.data.user.privilege === "student") {
          toast.error("Sorry, your a student!", {
            hideProgressBar: true,
            draggable: false
          });
        } else {
          if (res.data.user.key !== undefined) {
            if (
              res.data.user.key !== this.props.validatedKey ||
              res.data.user.sub !== user.sub
            ) {
              toast.error("Sorry, its not your key", {
                hideProgressBar: true,
                draggable: false
              });
            } else {
              if (res.data.user.privilege !== "mentor") {
                toast.error("Sorry, you're not a mentor", {
                  hideProgressBar: true,
                  draggable: false
                });
              } else {
                api.fetch(`/status/${data.sub}/active`, "patch").then(res => {
                  socket.emit("active", res.data.user);
                  localStorage.setItem("id_token", token);
                  window.location.href = "/cohorts";
                });
              }
            }
          } else {
            api.fetch(`/status/${data.sub}/active`, "patch").then(res => {
              socket.emit("active", res.data.user);
              localStorage.setItem("id_token", token);
              window.location.href = "/cohorts";
            });
          }
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{ fontSize: "18px" }}>
            {this.props.title}
          </Typography>
        </DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <DialogContentText id="alert-dialog-description">
            Please sign in with your google account
          </DialogContentText>

          <GoogleLogin
            clientId={process.env.REACT_APP_.GOOGLE_CLIENT_ID}
            onSuccess={this.responseGoogleMentor}
            onFailure={this.responseGoogleMentor}
            cookiePolicy={"single_host_origin"}
            buttonText="Sign-in"
          />
        </DialogContent>
      </React.Fragment>
    );
  }
}
