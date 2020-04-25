import React, { Component } from "react";
import decode from "jwt-decode";
import { withStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Person from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import AuthService from "../../auth/services";
import PageLoader from "../common-components/loader/loader";

import api from "../../services/fetchApi";

const styles = {
  paper: {
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 2,
    backgroundColor: "#780aaf"
  },
  form: {
    width: "100%",
    marginTop: 18
  },
  submit: {
    marginTop: 7,
    backgroundColor: "#780aaf",
    "&:hover": {
      backgroundColor: "#a219e6"
    }
  },
  link: {
    marginTop: 10
  }
};

class signIn extends Component {
  constructor() {
    super();

    this.Auth = new AuthService();

    this.state = {
      pageLoader: false,
      username: " ",
      password: " ",
      showSpinner: false
    };
  }

  componentDidMount() {
    document.title = "Sign-in";
    if (this.Auth.getToken() !== null) {
      const decodedToken = decode(this.Auth.getToken());
      if (decodedToken.adminId !== undefined) {
        api.fetch(`/admin/details/${decodedToken.adminId}`, "get").then(res => {
          if (res.data.admin[0].password === "Admin123") {
            window.location.href = "/admin/default";
          } else {
            if (this.Auth.loggedIn()) {
              window.location.href = "/admin/keys";
            }
          }
        });
      } else {
        window.location.href = "/404";
      }
    }
  }

  inputChecker = (value, option) => {
    this.setState({ [option]: value });
  };

  login = e => {
    e.preventDefault();
    this.Auth.login(this.state.username, this.state.password).then(res => {
      if (res.token === null) {
        toast.error("Invalid username or password", {
          hideProgressBar: true,
          draggable: false
        });
      } else {
        this.Auth.setToken(res.token);
        if (this.state.password === "Admin123") {
          this.setState({ pageLoader: true });
          setTimeout(() => {
            window.location.href = "/admin/default";
          }, 4000);
        } else {
          this.setState({ pageLoader: true });
          setTimeout(() => {
            window.location.href = "/admin/keys";
          }, 2000);
        }
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Container
        component="main"
        maxWidth={this.state.pageLoader ? "sm" : "xs"}
        mt={100}
      >
        <ToastContainer
          enableMultiContainer
          position={toast.POSITION.TOP_RIGHT}
        />
        {this.state.pageLoader ? (
          <div style={{ marginTop: "50%" }}>
            <PageLoader
              content={
                this.state.password === "Admin123"
                  ? "Redirecting, please bear for a second..."
                  : "Logging in..."
              }
              width="600px"
            />
          </div>
        ) : (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <Person />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin
            </Typography>
            <form className={classes.form} onSubmit={this.login}>
              <TextField
                style={{ marginBottom: "-3px" }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                error={this.state.username === "" ? true : false}
                helperText={
                  this.state.username === "" ? "Username is required" : " "
                }
                InputLabelProps={{ required: false }}
                onBlur={e => this.inputChecker(e.target.value, "username")}
                onChange={e => this.inputChecker(e.target.value, "username")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={this.state.password === "" ? true : false}
                helperText={
                  this.state.password === "" ? "Password is required" : " "
                }
                InputLabelProps={{ required: false }}
                onBlur={e => this.inputChecker(e.target.value, "password")}
                onChange={e => this.inputChecker(e.target.value, "password")}
              />
              ​
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.login}
              >
                Sign In
              </Button>
            </form>
          </div>
        )}
      </Container>
    );
  }
}

export default withStyles(styles)(signIn);
