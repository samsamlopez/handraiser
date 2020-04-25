import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
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

class RemoveRequest extends Component {
  render() {
    return (
      <div>
        <Dialog
          fullWidth
          open={this.props.removeStudentReqModal}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle style={{ fontSize: "10px" }}>
            <Typography> </Typography>

            {"Remove this Request?"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={this.props.removeStudentReqClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.props.removeStudentReqClose();
                this.props.deleteRequest(this.props.member);
              }}
              color="primary"
              autoFocus
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(RemoveRequest);
