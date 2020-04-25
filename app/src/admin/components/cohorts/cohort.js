import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import KeyBoardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyBoardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import TableLoader from "../common-components/table/loader";
import StudentList from "../common-components/dialogs/studentList";
import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";
import Auth from "../../auth/auth";
import api from "../../services/fetchApi";

import styles from "./cohort.component.style";

class Cohorts extends React.Component {
  constructor() {
    super();

    this.state = {
      loader: true,
      open: true,
      studentListDialog: false,
      search: "",
      sortCohort: "",
      sortMentor: false,
      mentors: [],
      cohorts: [],
      students: [],
      cohortId: ""
    };
  }

  componentDidMount() {
    document.title = "Cohorts";

    api.fetch("/cohorts", "get").then(res => {
      this.setState({ cohorts: res.data.cohorts });
    });

    api.fetch("/mentors", "get").then(res => {
      this.setState({ mentors: res.data.mentors });
    });

    api.fetch("/students", "get").then(res => {
      this.setState({ students: res.data.students });
      setTimeout(() => {
        this.setState({ loader: false });
      }, 1000);
    });
  }

  handleDrawerOpen = () => this.setState({ open: true });
  handleDrawerClose = () => this.setState({ open: false });

  handleSearch = e => this.setState({ search: e.target.value });

  sortCohortName = () => {
    if (this.state.sortCohort) {
      this.setState({
        cohorts: this.state.cohorts.reverse(),
        sortCohort: false
      });
    } else {
      this.setState({
        cohorts: this.state.cohorts.reverse(),
        sortCohort: true
      });
    }
  };

  sortMentor = () => {
    if (this.state.sortMentor) {
      api
        .fetch(`/cohorts/mentors/${this.state.sortMentor}`, "get")
        .then(res => {
          this.setState({ cohorts: res.data.cohorts, sortMentor: false });
        });
    } else {
      api
        .fetch(`/cohorts/mentors/${this.state.sortMentor}`, "get")
        .then(res => {
          this.setState({ cohorts: res.data.cohorts, sortMentor: true });
        });
    }
  };

  closeStudentListDialog = () => this.setState({ studentListDialog: false });

  getMentorName = id => {
    let name = "";
    this.state.mentors.map(mentor => {
      if (mentor.id === id) name = mentor.first_name + " " + mentor.last_name;
      return name;
    });
    return name;
  };

  getNoOfStudents = id => {
    let count = 0;
    this.state.students.forEach(student => {
      if (student.cohort_id === id) count += 1;
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
                title="Cohorts"
                classes={{ action: classes.actionSearch }}
                action={
                  <Grid item={true} xs={8} sm={12}>
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search by cohort name or mentor"
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
                <TableLoader content="Loading cohorts..." />
              ) : (
                <div className={classes.scroll}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          onClick={this.sortCohortName}
                          style={{ cursor: "pointer" }}
                          className={classes.stickyHeader}
                        >
                          Cohort name
                          {this.state.sortCohort ? (
                            <Tooltip
                              title="Sort by cohort name"
                              placement="top-start"
                            >
                              <KeyBoardArrowUpIcon
                                className={classes.iconSort}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title="Sort by cohort name"
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
                          onClick={this.sortMentor}
                          style={{ cursor: "pointer" }}
                          className={classes.stickyHeader}
                        >
                          Mentor
                          {this.state.sortMentor ? (
                            <Tooltip
                              title="Sort by mentor"
                              placement="top-start"
                            >
                              <KeyBoardArrowUpIcon
                                className={classes.iconSort}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title="Sort by mentor"
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
                          className={classes.stickyHeader}
                        >
                          No. of students
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.cohorts.map((cohort, i) => {
                        if (this.state.search) {
                          if (
                            cohort.name
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase()) ||
                            this.getMentorName(cohort.mentor_id)
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase())
                          ) {
                            return (
                              <TableRow key={i} className={classes.row}>
                                <TableCell align="center">
                                  {cohort.name}
                                </TableCell>
                                <TableCell align="center">
                                  {this.getMentorName(cohort.mentor_id)}
                                </TableCell>
                                {this.getNoOfStudents(cohort.id) === 0 ? (
                                  <TableCell align="center">
                                    {this.getNoOfStudents(cohort.id)}
                                  </TableCell>
                                ) : (
                                  <Tooltip
                                    title="View students"
                                    placement="top-start"
                                  >
                                    <TableCell
                                      align="center"
                                      onClick={() =>
                                        this.setState({
                                          studentListDialog: true,
                                          cohortId: cohort.id
                                        })
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {this.getNoOfStudents(cohort.id)}
                                    </TableCell>
                                  </Tooltip>
                                )}
                              </TableRow>
                            );
                          }
                        } else {
                          return (
                            <TableRow key={i} className={classes.row}>
                              <TableCell align="center">
                                {cohort.name}
                              </TableCell>
                              <TableCell align="center">
                                {this.getMentorName(cohort.mentor_id)}
                              </TableCell>

                              {this.getNoOfStudents(cohort.id) === 0 ? (
                                <TableCell align="center">
                                  {this.getNoOfStudents(cohort.id)}
                                </TableCell>
                              ) : (
                                <Tooltip
                                  title="View students"
                                  placement="top-start"
                                >
                                  <TableCell
                                    align="center"
                                    onClick={() =>
                                      this.setState({
                                        studentListDialog: true,
                                        cohortId: cohort.id
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {this.getNoOfStudents(cohort.id)}
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
          open={this.state.studentListDialog}
          onClose={this.closeStudentListDialog}
          scroll={"paper"}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <StudentList
            cohortId={this.state.cohortId}
            close={this.closeStudentListDialog}
          />
        </Dialog>
      </div>
    );
  }
}

export default Auth(withStyles(styles)(Cohorts));
