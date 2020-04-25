import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";

import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";
import Student from "./studentQueue";

const styles = theme => ({
  root: {
    height: "100%",
    margin: "0 auto"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  drawerHeader: {
    marginTop: "10px",
    marginBottom: "-10px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  }
});

class PersistentDrawerLeft extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false
    };
  }
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    document.title = "Student Queue";
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NavBar
          open={this.state.open}
          title="Handraiser"
          handleDrawerOpenFn={this.handleDrawerOpen}
        />

        <SideNav
          open={this.state.open}
          handleDrawerCloseFn={this.handleDrawerClose}
        />

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: this.state.open
          })}
        >
          <div className={classes.drawerHeader} />
          <Student cohort_id={this.props.match.params.cid} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(PersistentDrawerLeft);
