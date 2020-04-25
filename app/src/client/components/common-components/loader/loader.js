import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";

const style = {
  spinner: {
    marginTop: "5%",
    color: "#35455a",
    "@media (max-width: 425px)": {
      width: "25px !important",
      height: "25px !important"
    }
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  loaderText: {
    color: "#5d5d5d",
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  loader: {
    marginTop: "17%",
    marginBottom: "auto",
    "@media (max-width: 425px)": {
      marginTop: "50%",
      marginBottom: "100%"
    }
  },
  linear: {
    marginTop: "2%",
    "@media (max-width: 425px)": {
      width: "300px !important"
    }
  }
};

class Loader extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.loader}
      >
        <Grid item={true} xs={12} sm={12} md={12} style={style.container}>
          <Typography
            variant="h5"
            component="h2"
            className={classes.loaderText}
          >
            {this.props.content}
          </Typography>
          {this.props.linear ? (
            <LinearProgress
              style={{ width: this.props.width }}
              className={classes.linear}
              classes={{ barColorPrimary: classes.linearSpinner }}
            />
          ) : (
            <CircularProgress className={classes.spinner} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(style)(Loader);
