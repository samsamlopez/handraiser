import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { Redirect } from "react-router-dom";

//AUTH
import AuthService from "../../../auth/AuthService";
import { Typography, Avatar } from "@material-ui/core";
import api from "../../../services/fetchApi";
import Online from "../../../images/active.png";
import io from "socket.io-client";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: 0,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow:
      "0 4px 0 rgba(60,64,67,0.302), 0 8px 12px 6px rgba(60,64,67,0.149)"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  purpleAvatar: {
    color: "#fff",
    backgroundColor: "#673ab7"
  },
  classList: {
    maxHeight: "336px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  },
  classListOnlineUser: {
    maxHeight: "423px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  }
});

const socket = io("http://boom-handraiser.com:3001/");

class SideNav extends React.Component {
  constructor() {
    super();

    this.Auth = new AuthService();
    this.fetch = this.Auth.getFetchedTokenAPI();

    this.state = {
      user: [],
      members: [],
      cohorts: [],
      online: [],
      subCohorts: [],
      chatmateSub: "",
      myCohorts: []
    };
  }

  // start of normal chatting

  selectChatmate = studentInfo => {
    this.setState({ chatmateSub: studentInfo.sub });
  };

  // end of normal chatting

  UNSAFE_componentWillMount() {
    socket.on("active", user => {
      this.setState({
        online: [...user, ...this.state.online]
      });
    });
    socket.on("inactive", user => {
      let temp = this.state.online;
      temp = temp.filter(obj => {
        return obj.sub !== user[0].sub;
      });
      this.setState({
        online: temp
      });
    });
  }

  componentDidMount() {
    this.fetch.then(fetch => {
      const user = fetch.data.user[0];
      this.setState({ user });

      if (user.privilege === "student") {
        api.fetch(`/api/cohorts/enrolled/${user.id}`, "get").then(res => {
          this.setState({
            cohorts: res.data.cohorts
          });
        });
        api
          .fetch(
            `/api/fetchCohortsSubCohorts/${this.state.user.id}/${this.state.user.privilege}`,
            "get"
          )
          .then(data => {
            this.setState({ myCohorts: data.data });
          });
      } else {
        api.fetch(`/api/mentor/${user.id}/cohorts/`, "get").then(res => {
          this.setState({
            cohorts: res.data.cohorts
          });
        });
        api.fetch(`/api/fetchCoMentorCohorts`, "get").then(data => {
          this.setState({ subCohorts: data.data });
        });

        api
          .fetch(
            `/api/fetchCohortsSubCohorts/${this.state.user.id}/${this.state.user.privilege}`,
            "get"
          )
          .then(data => {
            this.setState({ myCohorts: data.data });
          });
      }
      api.fetch(`/api/student/${user.id}/cohorts/`, "get").then(res => {
        this.setState({
          members: res.data.member
        });
      });
    });
    api.fetch(`/online`, "get").then(res => {
      this.setState({
        online: res.data.users
      });
    });
  }
  handleDrawerClose = () => {
    this.props.handleDrawerCloseFn();
  };

  render() {
    const { classes } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={this.props.open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Classes"].map(text => (
            <ListItem
              button
              key={text}
              onClick={() => (window.location.href = `/cohorts`)}
            >
              <ListItemIcon>{<HomeIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography
          style={{
            padding: "10px 0px 0px 10px",
            color: "gray",
            textTransform: "uppercase",
            fontSize: "12px"
          }}
          variant="subtitle2"
        >
          {this.state.user.privilege === "mentor" ? "My Classes" : "Enrolled"}
        </Typography>
        <List className={classes.classList}>
          {this.props.socket
            ? this.props.cohorts.map(cohort =>
                this.state.user.privilege === "mentor" ? (
                  this.state.user.id === cohort.mentor_id ? (
                    <ListItem
                      button
                      key={cohort.name}
                      onClick={() =>
                        (window.location.href = `/queue/${cohort.id}`)
                      }
                    >
                      <ListItemIcon>
                        <Avatar className={classes.purpleAvatar}>
                          {cohort.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={cohort.name} />
                    </ListItem>
                  ) : (
                    (() => {
                      return this.state.subCohorts.map(row => {
                        if (
                          row.user_id === this.state.user.id &&
                          row.id === cohort.id
                        ) {
                          return (
                            <ListItem
                              button
                              key={cohort.name}
                              onClick={() =>
                                (window.location.href = `/queue/${cohort.id}`)
                              }
                            >
                              <ListItemIcon>
                                <Avatar className={classes.purpleAvatar}>
                                  {cohort.name.charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText primary={cohort.name} />
                            </ListItem>
                          );
                        }
                        return null;
                      });
                    })()
                  )
                ) : (
                  <ListItem
                    button
                    key={cohort.name}
                    onClick={() =>
                      (window.location.href = `/queue/${cohort.id}`)
                    }
                  >
                    <ListItemIcon>
                      <Avatar className={classes.purpleAvatar}>
                        {cohort.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={cohort.name} />
                  </ListItem>
                )
              )
            : //-------------------------------------------SOCKET FALSE---------------------------------------------------
              this.state.myCohorts.map(cohort => {
                return (
                  <ListItem
                    button
                    key={cohort.name}
                    onClick={() =>
                      (window.location.href = `/queue/${cohort.id}`)
                    }
                  >
                    <ListItemIcon>
                      <Avatar className={classes.purpleAvatar}>
                        {cohort.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={cohort.name} />
                  </ListItem>
                );
              })}
        </List>
        <Divider />
        {/*CHAT*/}
        <Typography
          style={{
            padding: "10px 0px 0px 10px",
            color: "gray",
            textTransform: "uppercase",
            fontSize: "12px"
          }}
          variant="subtitle2"
        >
          Active Now
        </Typography>
        {
          this.state.user.privilege === 'student'?
          this.state.online.map(stud => (
          stud.sub !== this.state.user.sub && stud.privilege === 'student' ?
            <List key={stud.id}>
              <ListItem button onClick={() => this.selectChatmate(stud)}>
                <ListItemAvatar>
                  <div>
                    <Avatar
                      alt={stud.first_name + " " + stud.last_name}
                      src={stud.avatar}
                    />
                    <img
                      style={{
                        width: 35,
                        height: 35,
                        margin: 0,
                        position: "absolute",
                        top: 24,
                        left: 32
                      }}
                      src={Online}
                      alt=""
                    />
                  </div>
                </ListItemAvatar>
                <ListItemText
                  primary={stud.first_name + " " + stud.last_name}
                />
              </ListItem>
            </List>
            :
            null
        ))
      :
      this.state.online.map(stud => (
        stud.sub !== this.state.user.sub && stud.privilege === 'mentor' ?
          <List key={stud.id}>
            <ListItem button onClick={() => this.selectChatmate(stud)}>
              <ListItemAvatar>
                <div>
                  <Avatar
                    alt={stud.first_name + " " + stud.last_name}
                    src={stud.avatar}
                  />
                  <img
                    style={{
                      width: 35,
                      height: 35,
                      margin: 0,
                      position: "absolute",
                      top: 24,
                      left: 32
                    }}
                    src={Online}
                    alt=""
                  />
                </div>
              </ListItemAvatar>
              <ListItemText primary={stud.first_name + " " + stud.last_name} />
            </ListItem>
          </List>
          :
          null
      ))}

        {this.state.chatmateSub ? (
          <Redirect
            to={{
              pathname: `/chat/${this.state.chatmateSub}`
            }}
          />
        ) : null}
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideNav);
