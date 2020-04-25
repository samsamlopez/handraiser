import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";

import TableLoader from "../common-components/table/loader";
import PageLoader from "../common-components/loader/loader";
import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";
import Auth from "../../auth/auth";
import AuthService from "../../auth/services";
import api from "../../services/fetchApi";

import styles from "./changePassword.component.style";

class Cohorts extends React.Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.token = this.Auth.getDecodedToken();

    this.state = {
      loader: true,
      pageLoader: false,
      open: true,
      confirmationDialog: false,
      password: "",
      newpassword: "",
      oldpassword: "",
      showOldPassword: false,
      showNewPassword: false,
      errorNewName: false,
      errorOldPass: false,
      errorNewPass: false,
      passwordMatch: true,
      newpasswordDisable: true
    };
  }

  componentDidMount() {
    document.title = "Change Password";

    api.fetch(`/admin/details/${this.token.adminId}`, "get").then(res => {
      this.setState({ password: res.data.admin[0].password });
      setTimeout(() => {
        this.setState({ loader: false });
      }, 1000);
    });
  }

  handleDrawerOpen = () => this.setState({ open: true });
  handleDrawerClose = () => this.setState({ open: false });

  handleClickShowOldPassword = () => {
    this.setState({ showOldPassword: !this.state.showOldPassword });
  };

  handleClickShowNewPassword = () => {
    this.setState({ showNewPassword: !this.state.showNewPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  checkOldPass = e => {
    if (e.target.value !== "") {
      this.setState({
        errorOldPass: false
      });
    } else {
      this.setState({
        errorOldPass: true
      });
    }
    this.setState({
      oldpassword: e.target.value
    });
  };

  onFocusToNewPass = () => {
    if (this.state.oldpassword !== this.state.password) {
      this.setState({
        passwordMatch: false
      });
    } else {
      this.setState({
        passwordMatch: true
      });
    }
  };

  checkOldPassBlur = e => {
    if (e.target.value === "") {
      this.setState({
        errorOldPass: true
      });
    }
    if (this.state.oldpassword !== this.state.password) {
      this.setState({
        passwordMatch: false
      });
    } else {
      this.setState({
        passwordMatch: true
      });
    }
  };

  checkNewPass = e => {
    if (e.target.value !== "") {
      this.setState({
        errorNewPass: false
      });
    } else {
      this.setState({
        errorNewPass: true
      });
    }
    this.setState({
      newpassword: e.target.value
    });
  };

  checkNewPassBlur = e => {
    if (e.target.value === "") {
      this.setState({
        errorNewPass: true
      });
    }
  };

  changePassword = () => {
    this.setState({ pageLoader: true });
    api
      .fetch(`/change-password/${this.token.adminId}`, "post", this.state)
      .then(res => {
        this.setState({
          confirmationDialog: false
        });
        setTimeout(() => {
          localStorage.removeItem("id_token");
          window.location.href = "/admin/sign-in";
        }, 4000);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.pageLoader ? (
          <PageLoader content="Logging out..." width="600px" />
        ) : (
          <React.Fragment>
            <NavBar
              open={this.state.open}
              title="Handraiser Admin"
              handleDrawerOpenFn={this.handleDrawerOpen}
            />

            <SideNav
              open={this.state.open}
              handleDrawerCloseFn={this.handleDrawerClose}
            />

            <main
              className={clsx(classes.content, {
                [classes.contentShift]: this.state.open
              })}
            >
              <div className={classes.drawerHeader} />
              <Paper className={classes.paper}>
                <Card className={classes.cardContact}>
                  <CardHeader
                    className={classes.cardHeader}
                    title="Change Password"
                    classes={{ action: classes.actionSearch }}
                  />
                  {this.state.loader ? (
                    <TableLoader content="Loading details..." />
                  ) : (
                    <div className={classes.scroll}>
                      <Card className={classes.changePasswordCard}>
                        <CardHeader
                          className={classes.passwordCardHeader}
                          title="Password Details"
                          classes={{ title: classes.passwordCartTitle }}
                        />
                        <div
                          style={{
                            margin: "5%",
                            position: "relative",
                            height: "265px"
                          }}
                        >
                          <Grid container className={classes.itemSettings}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="h7" className={classes.name}>
                                Enter old password:
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={8}
                              className={classes.responsive}
                            >
                              <TextField
                                id="outlined-adornment-oldpassword"
                                className={clsx(
                                  classes.margin,
                                  classes.textField
                                )}
                                variant="outlined"
                                type={
                                  this.state.showOldPassword
                                    ? "text"
                                    : "password"
                                }
                                label="Old Password"
                                InputLabelProps={{
                                  classes: { outlined: classes.label }
                                }}
                                name="oldpassword"
                                defaultValue={this.state.oldpassword}
                                onChange={this.checkOldPass}
                                error={
                                  this.state.errorOldPass ||
                                  !this.state.passwordMatch
                                }
                                helperText={
                                  this.state.errorOldPass
                                    ? "Old password is required!"
                                    : !this.state.passwordMatch
                                    ? "Password is incorrect!"
                                    : " "
                                }
                                onBlur={this.checkOldPassBlur}
                                InputProps={{
                                  classes: { root: classes.input },
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        edge="end"
                                        aria-label="toggle password visibility"
                                        onClick={
                                          this.handleClickShowOldPassword
                                        }
                                        onMouseDown={
                                          this.handleMouseDownPassword
                                        }
                                      >
                                        {this.state.showPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            className={classes.itemSettings}
                            style={{ marginTop: "3%" }}
                          >
                            <Grid item xs={12} sm={4}>
                              <Typography variant="h6" className={classes.name}>
                                Enter new password:
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={8}
                              className={classes.responsive}
                            >
                              <TextField
                                id="outlined-adornment-newpassword"
                                className={clsx(
                                  classes.margin,
                                  classes.textField
                                )}
                                variant="outlined"
                                type={
                                  this.state.showNewPassword
                                    ? "text"
                                    : "password"
                                }
                                label="New Password"
                                InputLabelProps={{
                                  classes: { outlined: classes.label }
                                }}
                                name="newpassword"
                                defaultValue={this.state.newpassword}
                                onKeyUp={this.checkNewPass}
                                error={this.state.errorNewPass}
                                helperText={
                                  this.state.errorNewPass
                                    ? "New password is required!"
                                    : " "
                                }
                                onBlur={this.checkNewPassBlur}
                                onFocus={this.onFocusToNewPass}
                                InputProps={{
                                  classes: { root: classes.input },
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        edge="end"
                                        aria-label="toggle password visibility"
                                        onClick={
                                          this.handleClickShowNewPassword
                                        }
                                        onMouseDown={
                                          this.handleMouseDownPassword
                                        }
                                      >
                                        {this.state.showPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.settingsBtn}>
                            <Button
                              variant="contained"
                              size="small"
                              className={classes.button}
                              onClick={() =>
                                (window.location.href = `/admin/password`)
                              }
                            >
                              cancel
                            </Button>
                            {this.state.oldname ||
                            (this.state.newpassword !== "" &&
                              this.state.passwordMatch) ||
                            this.state.status !== this.state.oldStatus ? (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: "2%" }}
                                onClick={() =>
                                  this.setState({ confirmationDialog: true })
                                }
                              >
                                save
                              </Button>
                            ) : null}
                          </Grid>
                        </div>
                      </Card>
                    </div>
                  )}
                </Card>
              </Paper>
            </main>
          </React.Fragment>
        )}

        <Dialog
          open={this.state.confirmationDialog}
          onClose={this.closeStudentListDialog}
          scroll={"paper"}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to change your password?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is your new password "
              <i style={{ color: "#9b44af" }}>
                <b>{this.state.newpassword}</b>
              </i>
              ". If you click agree you will be logged out and will be required
              to log-in using your new password.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ confirmationDialog: false })}
              color="primary"
            >
              Disagree
            </Button>
            <Button
              onClick={() => this.changePassword()}
              color="primary"
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Auth(withStyles(styles)(Cohorts));
