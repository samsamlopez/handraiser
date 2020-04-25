import React, { Component } from "react";
//material ui
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
//api
import api from "../../services/fetchApi";

import ChatBox from "../chat-box/chatBox";
import ConfirmationDialog from "./doneCofirmationmodal";

const styles = theme => ({
  dialogWrapper: {
    backgroundColor: "#780aaf",
    minHeight: "150px"
  },
  text: {
    textAlign: "center",
    color: "#fff"
  },
  action: {
    display: "flex",
    justifyContent: "space-between"
  },
  chatStyle: {
    "@media (max-width: 425px)": {
      boxShadow: "none",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },

  chatField: {
    position: "absolute",
    bottom: "5%",
    width: "90%"
  },
  chatButton: {
    position: "absolute",
    bottom: "6%",
    left: "52%"
  },
  list: {
    maxHeight: "52px",
    "&:hover .actionShow": {
      display: "inline-block"
    },
    "&:hover": {
      backgroundColor: "#f1f1f1"
    }
  },
  queueName: {
    fontSize: "17px"
  }
});

class BeingHelpedModal extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      chatBox: false,
      confirmationDialog: false
    };
  }

  viewChatBox = () => {
    this.setState({ chatBox: false });
  };

  openConfirmationDialog = () => this.setState({ confirmationDialog: true });
  closeConfirmationDialog = () => this.setState({ confirmationDialog: false });

  //move back student to the queue
  removeFromQueue = student => {
    const data = api.fetch(
      `/api/removebeinghelped/${student.id}/${this.props.cohort_id}`,
      "get"
    );
    data.then(res => {
      this.props.helpStudentClose();
      this.setState({ chatBox: false });
    });
  };

  //done helping student
  doneHelp = student => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let current_datetime = new Date();
    let formatted_date =
      months[current_datetime.getMonth()] +
      " " +
      current_datetime.getDate() +
      ", " +
      current_datetime.getFullYear();
    var time = current_datetime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    var datetime = formatted_date + " " + time;
    const data = api.fetch(
      `/api/doneHelp/${student.id}/${this.props.cohort_id}/${this.props.senderInfo.id}`,
      "post",
      {time: datetime}
    );
    data.then(res => {
      this.props.helpStudentClose();
      this.setState({ confirmationDialog: false });
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          fullWidth
          fullScreen={window.innerWidth < "425" ? true : false}
          open={
            this.props.helpingStudent.length !== 0
              ? false
              : this.props.helpStudentModal
          }
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle classes={{ root: classes.dialogWrapper }}>
            <Grid container justify="center">
              <Grid item xs={12} sm={12}>
                <Typography
                  variant="h6"
                  component="h3"
                  className={classes.text}
                >
                  Currently Helping...
                </Typography>
              </Grid>
              <Grid item xs={12} sm={7} className={classes.text}>
                <AccountCircle style={{ color: "#fff", fontSize: "60px" }} />
                {this.props.helpingStudent ? (
                  <Typography variant="h4" component="h3">
                    {this.props.helpingStudent.first_name
                      .charAt(0)
                      .toUpperCase() +
                      this.props.helpingStudent.first_name.slice(1)}{" "}
                    {this.props.helpingStudent.last_name
                      .charAt(0)
                      .toUpperCase() +
                      this.props.helpingStudent.last_name.slice(1)}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </DialogTitle>

          {!this.state.chatBox ? (
            <DialogActions>
              <Button
                color="primary"
                onClick={() => this.removeFromQueue(this.props.helpingStudent)}
              >
                Back
              </Button>
              <Button onClick={this.openConfirmationDialog} color="primary">
                Done
              </Button>

              <Button
                color="primary"
                onClick={() => {
                  this.setState({ chatBox: true });
                  this.props.sendChatSubM(this.props.helpingStudent.sub);
                }}
              >
                Chat
              </Button>
            </DialogActions>
          ) : (
            <React.Fragment>
              <ChatBox
                viewChatBox={this.viewChatBox}
                sendChatM={this.props.sendChatM}
                handleChatM={this.props.handleChatM}
                chatM={this.props.chatM}
                conversation={this.props.conversation}
                senderInfo={this.props.senderInfo}
                chatmateInfo={this.props.chatmateInfo}
                privileged={this.props.previledge}
                helpingStudent_sub={this.props.helpingStudent.sub}
                cohort_id={this.props.cohort_id}
                /*BADGE*/ displayBadge={this.props.displayBadge}
                chat={this.props.chat}
              />

              <DialogActions
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  color="primary"
                  onClick={() =>
                    this.removeFromQueue(this.props.helpingStudent)
                  }
                >
                  Back
                </Button>
                <Button onClick={this.openConfirmationDialog} color="primary">
                  Done
                </Button>
              </DialogActions>
            </React.Fragment>
          )}
        </Dialog>

        <Dialog
          fullWidth
          open={this.state.confirmationDialog}
          aria-labelledby="alert-dialog-title"
        >
          <ConfirmationDialog
            cancel={this.closeConfirmationDialog}
            doneHelp={this.doneHelp}
            helpingStudent={this.props.helpingStudent}
          />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(BeingHelpedModal);
