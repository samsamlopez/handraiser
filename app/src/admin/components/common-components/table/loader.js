import React, { Component } from "react";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const style = {
  spinner: {
    marginTop: "5%",
    color: "#35455a"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default class TableLoader extends Component {
  render() {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ marginTop: "15%", marginBottom: "38%" }}
      >
        <Grid item={true} xs={12} sm={12} md={12} style={style.container}>
          <Typography variant="h5" component="h2" style={{ color: "#5d5d5d" }}>
            {this.props.content}
          </Typography>
          <CircularProgress style={style.spinner} />
        </Grid>
      </Grid>
    );
  }
}
