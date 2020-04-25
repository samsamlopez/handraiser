import React from "react";
import decode from "jwt-decode";
import { GoogleLogout } from "react-google-login";

import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import MessageIcon from "@material-ui/icons/Message";
import AuthService from "../../../auth/AuthService";
import api from "../../../services/fetchApi";
import io from "socket.io-client";
import HeaderBg from "../../../images/header.jpg";
import { Redirect } from "react-router-dom";

import Badge from "@material-ui/core/Badge";

const socket = io("http://boom-handraiser.com:3001/");

const drawerWidth = 240;

const styles = theme => ({
  appBarBg: {
    backgroundColor: "#802694",
    backgroundImage: `url(${HeaderBg})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  avatar: {
    width: "40px",
    height: "40px",
    fontSize: "18px",
    boxShadow: "none",
    cursor: "pointer"
  },
  menuPaper: {
    marginTop: "2.2%"
  },
  menuList: {
    width: "330px",
    height: "130px"
  },
  menuGridIcon: {
    padding: "8% 2% 5% 4.6%"
  },
  menuAvatar: {
    width: "80px",
    height: "80px",
    fontSize: "40px",
    boxShadow: "none"
  },
  menuGridDetails: {
    padding: "5% 1% 0 2%"
  },
  name: {
    fontSize: "15px",
    fontWeight: "bold"
  },
  email: {
    paddingBottom: "12%",
    fontSize: "14px",
    color: "#676767"
  }
});

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    overflowWrap: "break-word",
    backgroundColor: "#515457",
    color: "#aeb0b9",
    maxWidth: 220,
    padding: "1% 5% 1% 5%",
    marginTop: "5px",
    marginRight: "5px",
    fontSize: theme.typography.pxToRem(12)
  }
}))(Tooltip);

const logout = sub => {
  api.fetch(`/status/${sub}/inactive`, "patch").then(res => {
    socket.emit("inactive", res.data.user);
    socket.emit("inactiveChat", res.data.user);
    localStorage.removeItem("id_token");
    window.location.href = "/sign-in";
  });
};

class NavBar extends React.Component {
  constructor() {
    super();

    this.Auth = new AuthService();
    this.token = this.Auth.getToken();
    this.profile = decode(this.token);
    this.fetch = this.Auth.getFetchedTokenAPI();

    this.state = {
      anchor: null,
      chat: false,
      userInfo: [],
      sub: "",
      conversation: []
    };
  }

  handleDrawerOpen = () => this.props.handleDrawerOpenFn();
  openLogoutMenu = e => this.setState({ anchor: e.currentTarget });
  closeLogoutMenu = () => this.setState({ anchor: null });

  UNSAFE_componentWillMount() {
    socket.on("countUnreadMessages", groupChat => {
      this.componentDidMount();
    });
  }

  componentDidMount() {
    this.fetch.then(fetch => {
      this.setState({
        sub: fetch.data.user[0].sub,
        userInfo: fetch.data.user[0]
      });
    });
    const data = api.fetch(`/api/getChat/`, "get");
    data.then(res => {
      this.setState({ conversation: [...res.data] });
    });
  }

  unreadMessages = () => {
    let count = 0;
    this.state.conversation.map(convo => {
      if (convo.chatmate_id === this.state.sub && convo.seen === 0) {
        count++;
      }
      return null;
    });
    return count;
  };

  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: this.props.open
        })}
        classes={{ colorPrimary: classes.appBarBg }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            className={clsx(
              classes.menuButton,
              this.props.open && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            style={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => (window.location.href = "/cohorts")}
          >
            {this.props.title}
          </Typography>
          <IconButton
            color="inherit"
            edge="start"
            style={{ marginRight: 15 }}
            onClick={() => this.setState({ chat: true })}
          >
            <MessageIcon />
            <Badge color="secondary" badgeContent={this.unreadMessages()} />
          </IconButton>
          <HtmlTooltip
            title={
              <React.Fragment>
                <p>
                  <b style={{ fontSize: "13px", color: "#ffffff" }}>
                    Google Account
                  </b>
                  <br />
                  <b>{this.profile.name}</b>
                  <br />
                  <b>{this.profile.email}</b>
                </p>
              </React.Fragment>
            }
            enterDelay={300}
          >
            <Avatar
              src={this.profile.picture}
              className={classes.avatar}
              onClick={e => this.openLogoutMenu(e)}
            ></Avatar>
          </HtmlTooltip>

          <Menu
            id="logout-menu"
            keepMounted
            anchorEl={this.state.anchor}
            open={Boolean(this.state.anchor)}
            onClose={this.closeLogoutMenu}
            classes={{ paper: classes.menuPaper, list: classes.menuList }}
          >
            <Grid container direction="row" justify="flex-start" wrap="wrap">
              <Grid item xs={4} className={classes.menuGridIcon}>
                <Avatar
                  src={this.profile.picture}
                  className={classes.menuAvatar}
                ></Avatar>
              </Grid>
              <Grid item xs={8} className={classes.menuGridDetails}>
                <div className={classes.name}>{this.profile.name}</div>
                <div className={classes.email}>{this.profile.email}</div>
                <GoogleLogout
                  clientId="915213711135-usc11cnn8rudrqqikfe21l246r26uqh8.apps.googleusercontent.com"
                  render={renderProps => (
                    <Button
                      variant="contained"
                      style={{ marginLeft: "18%" }}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Logout
                    </Button>
                  )}
                  onLogoutSuccess={() => logout(this.profile.sub)}
                  onFailure={() => logout(this.profile.sub)}
                ></GoogleLogout>
              </Grid>
            </Grid>
          </Menu>
        </Toolbar>
        {this.state.chat ? (
          <Redirect
            to={{
              pathname: `/chat/allMessages`
            }}
          />
        ) : null}
      </AppBar>
    );
  }
}

export default withStyles(styles)(NavBar);
