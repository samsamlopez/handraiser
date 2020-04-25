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

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
      groupName: "",
      search: "",
      allUsers: [],
      btnCreate: true,
      groupLists: [],
      groupNameExist: false,
      helperText: "",
      selectAll: false
    };
  }

  componentDidMount() {
    api.fetch(`/api/getAllUsers`, "get").then(res => {
      this.setState({ allUsers: res.data });
    });
    api.fetch(`/api/getAllGroupName`, "get").then(res => {
      this.setState({ groupLists: [...res.data] });
    });
  }

  btnCreateToggle = (name, groupExist) => {
    if (name.length > 1 && this.state.checked.length > 1 && !groupExist) {
      this.setState({ btnCreate: false });
    } else {
      this.setState({ btnCreate: true });
    }
  };

  checkGroupName = value => {
    let exist = false;
    this.state.groupLists.map(data => {
      if (data.name.toLowerCase() === value.toLowerCase()) {
        exist = true;
      }
      return null;
    });
    this.setState({ groupNameExist: exist });
    if (exist) {
      this.setState({ helperText: "Group Name Already Exist" });
    } else {
      this.setState({ helperText: "" });
    }

    return exist;
  };

  handleToggle = value => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if (
      this.state.groupName.length > 1 &&
      newChecked.length > 1 &&
      !this.state.groupNameExist
    ) {
      this.setState({ btnCreate: false });
    } else {
      this.setState({ btnCreate: true });
    }

    this.setState({ checked: newChecked });
  };

  handleDelete = id => {
    const currentIndex = this.state.checked.indexOf(id);
    const newChecked = [...this.state.checked];
    newChecked.splice(currentIndex, 1);

    this.setState({ checked: newChecked });
  };

  createGroup = () => {
    var postData = {
      groupName: this.state.groupName,
      creatorId: this.props.sub,
      userId: [this.props.sub, ...this.state.checked]
    };
    api.fetch(`/api/createGroupChat`, "post", postData).then(res => {
      socket.emit("createGroupChat", res.data);
    });
    this.setState({
      groupName: "",
      creatorId: "",
      checked: [],
      btnCreate: true
    });
  };

  toggleSelectAll = (users) => {
    this.setState({selectAll: !this.state.selectAll})
    var newChecked = []
    if(!this.state.selectAll){
      users.map(value => {
        newChecked.push(value.sub)
      })
      this.setState({ checked: newChecked });
    }else{
      this.setState({ checked: [] });
    }

    if (
      this.state.groupName.length > 1 &&
      newChecked.length > 1 &&
      !this.state.groupNameExist
    ) {
      this.setState({ btnCreate: false });
    } else {
      this.setState({ btnCreate: true });
    }
  }

  render() {
    const { classes } = this.props;
    const userFilter = this.state.allUsers.filter(data => {
      if (data.sub !== this.props.sub) {
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
      }
      return null;
    });
    return (
      <Dialog
        open={this.props.openDialog}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">
          Create Group
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
            label="Group Name"
            className={clsx(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            fullWidth
            style={{ marginTop: "2px" }}
            onChange={event => {
              this.setState({ groupName: event.target.value });
              this.btnCreateToggle(
                event.target.value,
                this.checkGroupName(event.target.value)
              );
            }}
            onBlur={event => {
              this.checkGroupName(event.target.value);
            }}
            helperText={this.state.helperText}
            error={this.state.groupNameExist}
          />

          <TextField
            label="Search"
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
              <ListItem
                key={'selectAll'}
                dense
                button
                onClick={()=>{
                  this.toggleSelectAll(userFilter)
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={this.state.selectAll}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Select All"

                />
              </ListItem>



              {userFilter.map(value => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <ListItem
                    key={value.id}
                    role={undefined}
                    dense
                    button
                    onClick={()=>{
                      this.handleToggle(value.sub)
                    }}
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
                return this.state.allUsers.map(data => {
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
            disabled={this.state.btnCreate}
            onClick={() => {
              this.props.handleClose();
              this.createGroup();
            }}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CreateGroup);
