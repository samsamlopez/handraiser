import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import KeyBoardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyBoardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import TableLoader from "../common-components/table/loader";
import CohortList from "../common-components/dialogs/cohortList";
import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";
import Auth from "../../auth/auth";
import api from "../../services/fetchApi";

import styles from "./mentor.component.style";

class Mentor extends React.Component {
  constructor() {
    super();

    this.state = {
      loader: true,
      open: true,
      cohortListDialog: false,
      search: "",
      sort: "",
      mentors: [],
      cohorts: [],
      mentorId: ""
    };
  }

  componentDidMount() {
    document.title = "Mentor List";
    api.fetch("/mentors", "get").then(res => {
      this.setState({ mentors: res.data.mentors });
    });

    api.fetch("/cohorts", "get").then(res => {
      this.setState({ cohorts: res.data.cohorts });
      setTimeout(() => {
        this.setState({ loader: false });
      }, 1000);
    });
  }

  handleDrawerOpen = () => this.setState({ open: true });
  handleDrawerClose = () => this.setState({ open: false });

  handleSearch = e => this.setState({ search: e.target.value });

  sortFirstName = () => {
    if (this.state.sort) {
      this.setState({ mentors: this.state.mentors.reverse(), sort: false });
    } else {
      this.setState({ mentors: this.state.mentors.reverse(), sort: true });
    }
  };

  closeMentortListDialog = () => this.setState({ cohortListDialog: false });

  getNoOfClasses = id => {
    let count = 0;
    this.state.cohorts.forEach(cohort => {
      if (cohort.mentor_id === id) count += 1;
      return count;
    });
    return count;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar
          open={this.state.open}
          title="Handraiser Admin"
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
          <Paper className={classes.paper}>
            <Card className={classes.cardContact}>
              <CardHeader
                className={classes.cardHeader}
                title="Mentors"
                classes={{ action: classes.actionSearch }}
                action={
                  <Grid item={true} xs={8} sm={12}>
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search by name"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput
                        }}
                        inputProps={{ "aria-label": "search" }}
                        onChange={e => this.handleSearch(e)}
                      />
                    </div>
                  </Grid>
                }
              />
              {this.state.loader ? (
                <TableLoader content="Loading mentors..." />
              ) : (
                <div className={classes.scroll}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="left"
                          style={{
                            width: "6%",
                            padding: "0 16px",
                            cursor: "pointer"
                          }}
                          onClick={this.sortFirstName}
                          className={classes.stickyHeader}
                        >
                          Name
                          {this.state.sort ? (
                            <Tooltip
                              title="Sort by first name"
                              placement="top-start"
                            >
                              <KeyBoardArrowUpIcon
                                className={classes.iconSort}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title="Sort by first name"
                              placement="top-start"
                            >
                              <KeyBoardArrowDownIcon
                                className={classes.iconSort}
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={this.sortFirstName}
                          style={{
                            cursor: "pointer"
                          }}
                          className={classes.stickyHeader}
                        />
                        <TableCell
                          align="center"
                          className={classes.stickyHeader}
                        >
                          No. of classes
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.mentors.map((mentor, i) => {
                        if (this.state.search) {
                          if (
                            mentor.first_name
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase()) ||
                            mentor.last_name
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase())
                          ) {
                            return (
                              <TableRow key={i} className={classes.row}>
                                <TableCell align="right">
                                  <Avatar src={mentor.avatar} />
                                </TableCell>
                                <TableCell align="left">
                                  {mentor.first_name + " " + mentor.last_name}
                                </TableCell>
                                {this.getNoOfClasses(mentor.id) === 0 ? (
                                  <TableCell align="center">
                                    {this.getNoOfClasses(mentor.id)}
                                  </TableCell>
                                ) : (
                                  <Tooltip
                                    title="View classes"
                                    placement="top-start"
                                  >
                                    <TableCell
                                      align="center"
                                      onClick={() =>
                                        this.setState({
                                          cohortListDialog: true,
                                          mentorId: mentor.id
                                        })
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {this.getNoOfClasses(mentor.id)}
                                    </TableCell>
                                  </Tooltip>
                                )}
                              </TableRow>
                            );
                          }
                        } else {
                          return (
                            <TableRow key={i} className={classes.row}>
                              <TableCell align="right">
                                <Avatar src={mentor.avatar} />
                              </TableCell>
                              <TableCell align="left">
                                {mentor.first_name + " " + mentor.last_name}
                              </TableCell>

                              {this.getNoOfClasses(mentor.id) === 0 ? (
                                <TableCell align="center">
                                  {this.getNoOfClasses(mentor.id)}
                                </TableCell>
                              ) : (
                                <Tooltip
                                  title="View classes"
                                  placement="top-start"
                                >
                                  <TableCell
                                    align="center"
                                    onClick={() =>
                                      this.setState({
                                        cohortListDialog: true,
                                        mentorId: mentor.id
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {this.getNoOfClasses(mentor.id)}
                                  </TableCell>
                                </Tooltip>
                              )}
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </Paper>
        </main>

        <Dialog
          open={this.state.cohortListDialog}
          onClose={this.closeMentortListDialog}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          fullWidth={true}
          maxWidth={"sm"}
        >
          <CohortList
            mentorId={this.state.mentorId}
            close={this.closeMentortListDialog}
          />
        </Dialog>
      </div>
    );
  }
}

export default Auth(withStyles(styles)(Mentor));
