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
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ListIcon from "@material-ui/icons/List";
import SchoolIcon from "@material-ui/icons/School";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
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
  link: {
    color: "#212121",
    textDecoration: "none"
  }
});

class SideNav extends React.Component {
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
        <Typography
          style={{
            padding: "10px 0px 0px 10px",
            color: "gray",
            textTransform: "uppercase",
            fontSize: "12px"
          }}
          variant="subtitle2"
        >
          {"Navigation"}
        </Typography>
        <List>
          <ListItem
            button
            onClick={() => (window.location.href = "/admin/keys")}
          >
            <ListItemIcon>
              <VpnKeyIcon />
            </ListItemIcon>
            <ListItemText>Generated Keys</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => (window.location.href = "/admin/mentors")}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText>Mentors</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => (window.location.href = "/admin/cohorts")}
          >
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText>Cohorts</ListItemText>
          </ListItem>
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
          {"Settings"}
        </Typography>
        <List>
          <ListItem
            button
            onClick={() => (window.location.href = "/admin/password")}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>Change Password</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideNav);
