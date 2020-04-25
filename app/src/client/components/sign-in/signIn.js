import React, { Component } from "react";
import decode from "jwt-decode";
import $ from "jquery";

import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Person from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import GoogleLogin from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./signIn.component.style";

import api from "../../services/fetchApi";
import AuthService from "../../auth/AuthService";
import SignInKey from "./dialogs/validateKey";
import GoogleSignIn from "./dialogs/googleSignIn";
import PageLoader from "../../../admin/components/common-components/loader/loader";
import io from "socket.io-client";

const socket = io("http://boom-handraiser.com:3001/");

class SignInSide extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();

    this.state = {
      validateKeyDialog: false,
      signInGoogleDialog: false,
      hiddenSignInDialog: false,
      pageLoader: false,
      usernameAdmin: " ",
      passwordAdmin: " ",
      validatedKey: ""
    };
  }

  handleChange = (e, options) => {
    this.setState({
      [options]: e.target.value
    });
  };

  componentDidMount() {
    document.title = "Welcome to Handraiser";
    if (this.Auth.getToken() !== null) {
      const decodedToken = decode(this.Auth.getToken());
      if (decodedToken.sub !== undefined) {
        if (this.Auth.loggedIn()) {
          window.location.href = "/cohorts";
        }
      } else {
        window.location.href = "/404";
      }
    }

    const changeState = this;

    $(document).on("keydown", function(e) {
      if (e.altKey && e.ctrlKey && e.shiftKey && e.which === 33) {
        changeState.setState({ hiddenSignInDialog: true });
      }
    });
  }

  openValidateKeyDialog = () => this.setState({ validateKeyDialog: true });
  closeValidateKeyDialog = () => this.setState({ validateKeyDialog: false });
  getValidatedKey = key => {
    this.setState({ validatedKey: key });
  };

  openSignInGoogle = key => this.setState({ signInGoogleDialog: true });
  closeSignInGoogle = () => this.setState({ signInGoogleDialog: false });

  //UNCOMMENT THIS WHEN DEPLOY
  responseGoogleStudent = google => {
    if (google.expectedDomain === "boom.camp") {
      toast.error("Sorry, invalid email!", {
        hideProgressBar: true,
        draggable: false
      });
    } else {
      const user = decode(google.tokenId);
      const data = {
        first_name: user.given_name,
        last_name: user.family_name,
        sub: user.sub,
        privilege: "student",
        avatar: user.picture
      };

      api.fetch("/sign-in", "post", data).then(res => {
        console.log(res.data.user);
        if (res.data.user.privilege !== "student") {
          toast.error("Sorry, you're not a student", {
            hideProgressBar: true,
            draggable: false
          });
        } else {
          api.fetch(`/status/${data.sub}/active`, "patch").then(res => {
            socket.emit("active", res.data.user);
            socket.emit("activeChat", res.data.user);
            localStorage.setItem("id_token", google.tokenId);
            window.location.href = "/cohorts";
          });
        }
      });
    }
  };

  loginAdmin = e => {
    this.Auth.login(this.state.usernameAdmin, this.state.passwordAdmin).then(
      res => {
        if (res.token === null) {
          toast.error("Invalid username or password", {
            hideProgressBar: true,
            draggable: false
          });
        } else {
          this.setState({ hiddenSignInDialog: false });
          this.Auth.setToken(res.token);
          if (this.state.passwordAdmin === "Admin123") {
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
      }
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.state.pageLoader ? (
          <PageLoader
            content={
              this.state.password === "Admin123"
                ? "Redirecting, please bear for a second..."
                : "Logging in..."
            }
            width="600px"
            color="white"
          />
        ) : (
          <Container component="main" maxWidth="xs">
            <ToastContainer
              enableMultiContainer
              position={toast.POSITION.TOP_RIGHT}
            />
            {this.state.hiddenSignInDialog ? null : (
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <Person />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h6"
                  className={classes.title}
                >
                  Sign in as..
                </Typography>
                <form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <GoogleLogin
                        clientId={process.env.REACT_APP_.GOOGLE_CLIENT_ID}
                        // hostedDomain="boom.camp"
                        onSuccess={this.responseGoogleStudent}
                        onFailure={this.responseGoogleStudent}
                        cookiePolicy={"single_host_origin"}
                        render={renderProps => (
                          <Button
                            fullWidth={true}
                            className={`${classes.submit} ${classes.studentBtn}`}
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                          >
                            Student
                          </Button>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        className={classes.submit}
                        onClick={this.openValidateKeyDialog}
                      >
                        Mentor
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center">
                    <Grid item className={classes.footer}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                      >
                        {"Hand Raiser 2019. Created by Team 3."}
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              </div>
            )}
          </Container>
        )}

        <Dialog open={this.state.validateKeyDialog}>
          <SignInKey
            title="Enter sign-in key"
            label="Sign-in key"
            content="Ask administrator for your sign-in key"
            handleCancel={this.closeValidateKeyDialog}
            openSignInGoogleFn={this.openSignInGoogle}
            getValidatedKeyFn={this.getValidatedKey}
          />
        </Dialog>

        {/* SIGN IN WITH GOOGLE */}
        <Dialog
          open={this.state.signInGoogleDialog}
          onClose={this.closeSignInGoogle}
        >
          <GoogleSignIn
            validatedKey={
              this.state.validatedKey === "" ? null : this.state.validatedKey
            }
            title="Successfully, validated"
          />
        </Dialog>

        {/* HIDDEN SIGN IN FOR SUPER ADMIN */}
        <Dialog
          open={this.state.hiddenSignInDialog}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
        >
          <DialogTitle id="form-dialog-title">
            <Typography
              style={{
                color: "#802693",
                textAlign: "center",
                fontSize: "25px"
              }}
            >
              Welcome Admin!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "#888888" }}>
              This sign is just for you, please always secure your shortcut
              keys.
            </DialogContentText>
            <TextField
              style={{ marginTop: "2%", marginBottom: "-5px" }}
              margin="dense"
              id="name"
              label="Username"
              type="text"
              fullWidth
              onChange={e => this.handleChange(e, "usernameAdmin")}
              onBlur={e => this.handleChange(e, "usernameAdmin")}
              error={this.state.usernameAdmin === "" ? true : false}
              helperText={
                this.state.usernameAdmin === "" ? "Username is required" : " "
              }
              InputLabelProps={{ classes: { root: classes.inputLabel } }}
              InputProps={{ classes: { root: classes.inputField } }}
            />

            <TextField
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
              onChange={e => this.handleChange(e, "passwordAdmin")}
              onBlur={e => this.handleChange(e, "passwordAdmin")}
              error={this.state.passwordAdmin === "" ? true : false}
              helperText={
                this.state.passwordAdmin === "" ? "Password is required" : " "
              }
              onKeyUp={e => {
                if (e.key === "Enter") {
                  this.loginAdmin();
                }
              }}
              InputLabelProps={{ classes: { root: classes.inputLabel } }}
              InputProps={{ classes: { root: classes.inputField } }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ hiddenSignInDialog: false })}
              style={{ color: "#9600b5e0" }}
            >
              Cancel
            </Button>
            <Button
              classes={{ root: classes.signInBtn }}
              onClick={() => this.loginAdmin()}
              disabled={
                this.state.usernameAdmin === " " ||
                this.state.passwordAdmin === " " ||
                this.state.usernameAdmin === "" ||
                this.state.passwordAdmin === ""
                  ? true
                  : false
              }
              color="primary"
            >
              Sign in
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(SignInSide);
