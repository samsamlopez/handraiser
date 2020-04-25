import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton, InputAdornment } from "@material-ui/core";

import AuthDefault from "../../auth/authDefault";
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
  }
};

class defaultPassword extends Component {
  constructor() {
    super();

    this.Auth = new AuthService();
    this.token = this.Auth.getDecodedToken();

    this.state = {
      pageLoader: false,
      newpassword: " ",
      showPassword: false
    };
  }

  handleClickShowNewPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  changePassword = () => {
    this.setState({ pageLoader: true });
    api
      .fetch(`/change-password/${this.token.adminId}`, "post", this.state)
      .then(res => {
        setTimeout(() => {
          window.location.href = "/admin/keys";
        }, 4000);
      });
  };

  render() {
    const { classes } = this.props;
    console.log(this.token.adminId);

    return (
      <Container component="main" maxWidth="sm" mt={100}>
        <ToastContainer
          enableMultiContainer
          position={toast.POSITION.TOP_RIGHT}
        />
        <CssBaseline />
        {this.state.pageLoader ? (
          <div style={{ marginTop: "50%" }}>
            <PageLoader
              content="Processing password change... "
              width="600px"
            />
          </div>
        ) : (
          <div className={classes.paper}>
            <Typography
              component="h1"
              variant="h3"
              style={{ color: "#79329c" }}
            >
              Welcome Admin!
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              style={{ marginTop: "5%", fontSize: "18px", color: "#8c8c8c" }}
            >
              This is your first logged in, you are required to change the
              default password for securing the system. Please enter your desire
              password.
            </Typography>
            <form className={classes.form} onSubmit={this.login}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type={this.state.showPassword ? "text" : "password"}
                id="password"
                error={this.state.password === "" ? true : false}
                helperText={
                  this.state.password === "" ? "New password is required" : " "
                }
                InputLabelProps={{ required: false }}
                onBlur={e => this.setState({ newpassword: e.target.value })}
                onChange={e => this.setState({ newpassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowNewPassword}
                        onMouseDown={this.handleMouseDownPassword}
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
              ​
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.changePassword}
              >
                Save
              </Button>
            </form>
          </div>
        )}
      </Container>
    );
  }
}

export default AuthDefault(withStyles(styles)(defaultPassword));
