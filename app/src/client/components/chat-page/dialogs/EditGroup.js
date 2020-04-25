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
import Close from "@material-ui/icons/Close";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

import { ListItemText, DialogActions } from "@material-ui/core";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import api from "../../../services/fetchApi";
import io from "socket.io-client";
const socket = io("http://boom-handraiser.com:3001/");

class EditGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
      search: "",
      groupName: "",
      btnSave: true
    };
  }

  handleToggle = value => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if(newChecked.length > 0){
      this.setState({
        btnSave: false
      })
    }else{
      this.setState({
        btnSave: true
      })
    }

    this.setState({ checked: newChecked });
  };

  handleDelete = id => {
    const currentIndex = this.state.checked.indexOf(id);
    const newChecked = [...this.state.checked];
    newChecked.splice(currentIndex, 1);

    this.setState({ checked: newChecked });
  };

  updateGroup = () => {
    var postData = {
      userId: [...this.state.checked]
    };

    if (this.state.groupName !== this.props.groupName) {
      console.log("Updated Group Name");
      api
        .fetch(
          `/api/updateGroupName/${this.props.groupId}?groupName=${this.state.groupName}`,
          "patch"
        )
        .then(data => {
          console.log(data)
          socket.emit("createGroupChat", data.data);
        });
    } else {
      // console.log("No Changes")
    }

    if (this.state.checked.length > 0) {
      // /api/addMemberGroupChat/:groupId
      api
        .fetch(
          `/api/addMemberGroupChat/${this.props.groupId}`,
          "post",
          postData
        )
        .then(data => {
          socket.emit("createGroupChat", data.data);
          console.log(data);
        });
    }

    this.setState({ checked: [] });
  };

  toggleSave = (event) => {
    if(event.length > 2){
      this.setState({
        btnSave: false
      })
    }else{
      this.setState({
        btnSave: true
      })
    }
  }
  

  render() {
    const { classes } = this.props;
    // console.log(this.state.search)

    const userFilter = this.props.users.filter(data => {
      let fname =
        data.first_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1;
      let lname =
        data.last_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1;
      if (fname) {
        return fname;
      } else {
        return lname;
      }
    });

    return (
      <Dialog
        open={this.props.openDialog}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">
          Edit Group
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
          <TextField
            autoFocus
            defaultValue={`${this.props.groupName}`}
            label="Group Name"
            className={clsx(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            fullWidth
            style={{ marginTop: "2px" }}
            onChange={e => {
              this.setState({ groupName: e.target.value });
              this.toggleSave(e.target.value);
            }}
            onBlur={e => {
              this.setState({ groupName: e.target.value });
            }}
          />

          <TextField
            label="Add Member (search)"
            className={clsx(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            fullWidth
            style={{ marginTop: "2px" }}
            onChange={event => {
              this.setState({ search: event.target.value });
            }}
          />
          <Paper
            style={{ width: 480, height: 180, overflowY: "auto" }}
            className={classes.scrollBar}
          >
            <List>
              {userFilter.map(value => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <ListItem
                    key={value.id}
                    role={undefined}
                    dense
                    button
                    onClick={this.handleToggle(value.sub)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={this.state.checked.indexOf(value.sub) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemAvatar style={{ marginTop: "3px" }}>
                      <Avatar
                        style={{ width: 25, height: 25 }}
                        src={value.avatar}
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={`${value.first_name} ${value.last_name}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          <Paper
            style={{
              width: 480,
              marginTop: 10,
              display: this.state.checked.length > 0 ? "block" : "none"
            }}
          >
            {/* <div className={classes.flex}> */}
            <Typography variant="caption" style={{ padding: 8 }}>
              Selected Members - {this.state.checked.length}
            </Typography>
            {/* </div> */}
            <Divider />
            <div className={clsx(classes.memberList, classes.scrollBar)}>
              {this.state.checked.map(val => {
                return this.props.users.map(data => {
                  if (data.sub === val) {
                    return (
                      <Chip
                        avatar={<Avatar alt="sender" src={data.avatar} />}
                        label={`${data.first_name} ${data.last_name}`}
                        onDelete={() => {
                          this.handleDelete(val);
                        }}
                        className={classes.chip}
                        size="small"
                      />
                    );
                  }
                  return null;
                });
              })}
            </div>
          </Paper>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            disabled={this.state.btnSave}
            onClick={() => {
              this.props.handleClose();
              this.updateGroup();
              this.props.refreshComponent(this.props.groupId)
              socket.emit("refreshGroupName", [this.props.sub, this.props.groupId]);
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditGroup);
