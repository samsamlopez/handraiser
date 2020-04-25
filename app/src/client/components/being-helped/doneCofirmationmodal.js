import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  dialogWrapper: {
    backgroundColor: "#780aaf",
    minHeight: "150px"
  },
  text: {
    textAlign: "center",
    color: "#fff"
  }
});

class DoneHelp extends Component {
  render() {
    return (
      <React.Fragment>
        <DialogTitle style={{ fontSize: "10px" }}>
          <Typography> </Typography>

          {"Done Helping?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={this.props.cancel} color="primary">
            No
          </Button>
          <Button
            onClick={() => this.props.doneHelp(this.props.helpingStudent)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(DoneHelp);
