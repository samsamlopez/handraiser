import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "../ChatPageStyle";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";

//Compose
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SendIcon from "@material-ui/icons/Send";
import Close from "@material-ui/icons/Close";
import Chip from "@material-ui/core/Chip";

import { ListItemText } from "@material-ui/core";

import api from "../../../services/fetchApi";

class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      chatmate: [],
      chatText: "",
      searchChatName: ""
    };
  }

  componentDidMount() {
    const data = api.fetch(`/api/getAllUsers/`, "get");
    data.then(res => {
      this.setState({ students: [...res.data] });
    });
  }

  selectChatmate = chatmate => {
    this.setState({ chatmate });
  };

  sendNewChat = () => {
    this.props.sendChat(null, this.state.chatText, null, this.state.chatmate.sub, 'compose');
    this.setState({ chatText: "", chatmate: [] });
    this.props.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.openDialog}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Create New Message
          <IconButton
            size="small"
            style={{ float: "right" }}
            onClick={this.props.handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {this.state.chatmate.sub ? (
            <div
              className={classes.flex}
              style={{ justifyContent: "flex-start" }}
            >
              <Typography variant="subtitle2" size="small">
                To:{" "}
              </Typography>

              <Chip
                avatar={
                  <Avatar alt="sender" src={this.state.chatmate.avatar} />
                }
                label={`${this.state.chatmate.first_name}`}
                onDelete={() => {
                  this.setState({ chatmate: [] });
                }}
                className={classes.chip}
                size="small"
              />
            </div>
          ) : null}
          <TextField
            label="Search"
            className={clsx(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            fullWidth
            style={{ marginTop: "2px" }}
            onChange={e => this.setState({ searchChatName: e.target.value })}
          />
          <Paper
            style={{ width: 450, height: 180, overflowY: "auto" }}
            className={classes.scrollBar}
          >
            <List>
              {/* map here */}
              {this.props.userInfo.privilege === "student"
                ? this.state.students.map((stud, i) => {
                    if (
                      (stud.first_name
                        .toLowerCase()
                        .includes(this.state.searchChatName.toLowerCase()) &&
                        stud.privilege === "student" &&
                        this.props.sub !== stud.sub) ||
                      (stud.last_name
                        .toLowerCase()
                        .includes(this.state.searchChatName.toLowerCase()) &&
                        stud.privilege === "student" &&
                        this.props.sub !== stud.sub)
                    ) {
                      return (
                        <React.Fragment key={i}>
                          <ListItem
                            alignItems="flex-start"
                            button
                            onClick={() => this.selectChatmate(stud)}
                          >
                            <ListItemAvatar style={{ marginTop: "3px" }}>
                              <Avatar
                                style={{ width: 25, height: 25 }}
                                src={stud.avatar}
                              />
                            </ListItemAvatar>
                            <ListItemText>
                              {stud.first_name} {stud.last_name}
                            </ListItemText>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      );
                    }
                    return null;
                  })
                : this.state.students.map((stud, i) => {
                    if (
                      (stud.first_name
                        .toLowerCase()
                        .includes(this.state.searchChatName.toLowerCase()) &&
                        stud.privilege === "mentor" &&
                        this.props.sub !== stud.sub) ||
                      (stud.last_name
                        .toLowerCase()
                        .includes(this.state.searchChatName.toLowerCase()) &&
                        stud.privilege === "mentor" &&
                        this.props.sub !== stud.sub)
                    ) {
                      return (
                        <React.Fragment key={i}>
                          <ListItem
                            alignItems="flex-start"
                            button
                            onClick={() => this.selectChatmate(stud)}
                          >
                            <ListItemAvatar style={{ marginTop: "3px" }}>
                              <Avatar
                                style={{ width: 25, height: 25 }}
                                src={stud.avatar}
                              />
                            </ListItemAvatar>
                            <ListItemText>
                              {stud.first_name} {stud.last_name}
                            </ListItemText>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
            </List>
          </Paper>
          <div className={classes.flex}>
            <TextField
              fullWidth
              variant="outlined"
              label="Send Message"
              multiline
              margin="normal"
              rowsMax="4"
              onChange={e => this.setState({ chatText: e.target.value })}
              onKeyUp={e => {
                if (
                  e.target.value.replace(/^\s+/, "").replace(/\s+$/, "") !== ""
                ) {
                  if (e.key === "Enter" && !e.shiftKey) {
                    this.sendNewChat();
                  }
                }
              }}
            />
            <IconButton
              style={{ marginLeft: 3, marginTop: 3 }}
              onClick={() => this.sendNewChat()}
              disabled={
                this.state.chatText.replace(/^\s+/, "").replace(/\s+$/, "") !==
                  "" && this.state.chatmate.sub !== undefined
                  ? false
                  : true
              }
            >
              <SendIcon />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Compose);

