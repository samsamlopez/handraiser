import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

const style = {
  linearSpinner: {
    backgroundColor: "#9b44af"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  loaderText: {
    color: "#5d5d5d",
    fontSize: "25px",
    "@media (max-width: 425px)": {
      fontSize: "20px"
    }
  },
  loader: {
    marginTop: "17%",
    marginBottom: "auto",
    "@media (max-width: 425px)": {
      marginTop: "100%",
      marginBottom: "100%"
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
            variant="h4"
            component="h2"
            className={classes.loaderText}
            style={{ color: this.props.color }}
          >
            {this.props.content}
          </Typography>
          <LinearProgress
            style={{
              width: this.props.width,
              marginTop: "2%"
            }}
            classes={{ barColorPrimary: classes.linearSpinner }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(style)(Loader);
