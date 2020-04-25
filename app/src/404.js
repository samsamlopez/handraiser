import React, { Component } from "react";
import decode from "jwt-decode";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import PageNotFound from "./client/images/404.png";

const styles = theme => ({
  "@global": {
    body: {
      backgroundImage: `linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))`,
      backgroundColor: "#9418ab"
    },
    html: {
      height: "100%",
      margin: 0
    }
  },
  pageNotFound: {
    backgroundImage: `url(${PageNotFound})`,
    height: "190px",
    width: "35%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    fontSize: "3em",
    "@media (max-width: 480px)": {
      height: "110px",
      width: "50%"
    }
  },
  paper: {
    marginTop: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5%",
    backgroundColor: "#ffffffa1",
    borderRadius: "5px"
  },
  form: {
    width: "100%",
    marginTop: 1
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#630184"
  },
  titleHeader: {
    margin: "1% 0 1% 0",
    color: "#493581",
    fontSize: "3em",
    "@media (max-width: 480px)": {
      fontSize: "23px"
    }
  },
  title: {
    color: "#272727",
    fontSize: "18px",
    textAlign: "center",
    "@media (max-width: 480px)": {
      fontSize: "13px"
    }
  },
  backToHome: {
    color: "#490362",
    textAlign: "center",
    "@media (max-width: 480px)": {
      fontSize: "15px"
    }
  },
  arrowLeft: {
    position: "absolute",
    margin: "4px 0 0 -24px",
    "@media (max-width: 480px)": {
      margin: "1px 0 0 -20px",
      fontSize: "20px"
    }
  },
  submit: {
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#9129aa",
    color: "#fff",
    padding: "12px 0",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#a43cbd"
    }
  },
  studentBtn: {
    backgroundColor: "#6525dc",
    "&:hover": {
      backgroundColor: "#784bce"
    }
  },
  footer: {
    margin: "10% auto 0 auto"
  }
});

class NotFound extends Component {
  componentDidMount() {
    document.title = "Page Not Found";
  }

  render() {
    const { classes } = this.props;
    var decodedToken = null;
    if (localStorage.getItem("id_token")) {
      decodedToken = decode(localStorage.getItem("id_token"));
    }
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md">
          <div className={classes.paper}>
            <div className={classes.pageNotFound} />
            <Typography
              component="h1"
              variant="h6"
              className={classes.titleHeader}
            >
              Oops, page not found :(
            </Typography>
            <form className={classes.form}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  style={{ height: "50px", marginBottom: "5%" }}
                >
                  <Typography
                    component="h1"
                    variant="h6"
                    className={classes.title}
                  >
                    Looks like you've followed a broken link or entered a URL
                    that doesn't exist on this site.
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ height: "50px" }}>
                  <Typography
                    component="h1"
                    variant="h6"
                    className={classes.backToHome}
                  >
                    <KeyboardArrowLeft className={classes.arrowLeft} />
                    {decodedToken === null ? (
                      <Link
                        style={{ color: "#490362", cursor: "pointer" }}
                        onClick={() => (window.location.href = "/sign-in")}
                      >
                        Go to sign in page
                      </Link>
                    ) : decodedToken.sub === undefined ? (
                      (console.log(localStorage.getItem("id_token")),
                      (
                        <Link
                          style={{ color: "#490362", cursor: "pointer" }}
                          onClick={() => (window.location.href = "/admin/keys")}
                        >
                          Back to Home
                        </Link>
                      ))
                    ) : (
                      <Link
                        style={{ color: "#490362", cursor: "pointer" }}
                        onClick={() => (window.location.href = "/cohorts")}
                      >
                        Back to Home
                      </Link>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
        {/* SIGN IN WITH GOOGLE */}
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(NotFound);
