import React, { PureComponent } from "react";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { TabPanel, a11yProps } from "./props";
import AddIcon from "@material-ui/icons/Add";
import {
  withStyles,
  Paper,
  Typography,
  Divider,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fab
} from "@material-ui/core";

//NAVIGATION
import NavBar from "../nav-bar/navBar";
import SideNav from "../side-nav/sideNav";

//API
import api from "./../../../services/fetchApi";

//LOADER
import Loader from "../loader/loader";

import DeleteClass from "./modal/delete";
import AddCoMentor from "./modal/addCoMentor";

//File Upload
import S3FileUpload from "react-s3";
//config AMAZON S3
const config = {
  bucketName: "boomcamp",
  dirName: "handraiser/image-uploads/class-headers" /* optional */,
  region: "us-west-2",
  accessKeyId: "AKIAQQHQFF5EPNACIXE3",
  secretAccessKey: "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"
};

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
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  mainContent: {
    padding: theme.spacing(3, 4),
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
    marginTop: "25px",
    maxWidth: "780px",
    margin: "0 auto",
    maxHeight: "525px",
    minHeight: "525px",
    "@media (max-width: 598px)": {
      maxHeight: "558px"
    }
  },
  vTab: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    minHeight: "52vh",
    "@media (max-width: 425px)": {
      display: "inline-block"
    }
  },
  tabs: {
    paddingTop: 15,
    borderRight: `1px solid ${theme.palette.divider}`
  },
  header: {
    marginTop: 30
  },
  margin: {
    margin: theme.spacing(1)
  },
  textField: {
    flexBasis: 200,
    "@media (max-width: 425px)": {
      margin: "8px 5px",
      fontSize: 5
    }
  },
  divider: {
    marginTop: 9
  },
  name: {
    color: "#263238",
    fontSize: "15px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: "500",
    lineHeight: "20px",
    letterSpacing: "-0.05px"
  },
  itemSettings: {
    display: "flex",
    alignItems: "center"
  },
  button: {
    margin: theme.spacing(1),
    "@media (max-width: 425px)": {
      fontSize: "10px"
    }
  },
  deleteBtn: {
    margin: theme.spacing(1),
    color: "white",
    backgroundColor: "#b31010",
    "&:hover": {
      backgroundColor: "#a91111"
    },
    "@media (max-width: 425px)": {
      fontSize: "10px"
    }
  },
  settingsBtn: {
    position: "absolute",
    bottom: "10px",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    "@media (max-width: 425px)": {
      marginTop: 20,
      bottom: "0"
    }
  },
  responsive: {
    "@media (max-width: 599px)": {
      marginTop: 12
    }
  },
  tabPanel: {
    position: "relative",
    width: "600px",
    "@media (max-width: 425px)": {
      width: "100%",
      height: "280px"
    }
  },
  input: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9b44af"
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336 !important"
    },
    "@media (max-width: 425px)": {
      height: "40px",
      fontSize: "13px"
    }
  },
  label: {
    "&.Mui-error": {
      color: "#f44336 !important"
    },
    "&.Mui-focused": {
      color: "#9b44af"
    },
    "&.MuiInputLabel-shrink": {
      background: "white",
      paddingLeft: "6px",
      paddingRight: "6px"
    },
    "@media (max-width: 425px)": {
      fontSize: "11px",
      marginTop: "-6px",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, 2px) scale(0.75)"
      }
    }
  },
  avatar: {
    "@media (max-width: 425px)": {
      width: "35px",
      height: "35px"
    }
  },
  addIcon: {
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  fab: {
    "@media (max-width: 425px)": {
      width: "35px",
      height: "35px"
    }
  },
  list: {
    fontSize: "16px",
    "@media (max-width: 425px)": {
      fontSize: "14px"
    }
  },
  listItem: {
    "@media (max-width: 425px)": {
      paddingLeft: "1px"
    }
  }
});

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      loaderTab: false,
      id: this.props.match.params.cid,
      status: false,
      modal: false,
      oldStatus: false,
      oldname: "",
      name: "",
      newpassword: "",
      password: "",
      oldpassword: "",
      showOldPassword: false,
      showNewPassword: false,
      errorNewName: false,
      errorOldPass: false,
      errorNewPass: false,
      passwordMatch: true,
      newpasswordDisable: true,
      tab: 0,
      coMentor: [],
      modalAddMentor: false,
      mentors: [],
      cohortDetails: [],
      availableMentor: []
    };
  }

  componentDidMount() {
    document.title = "Settings";
    api
      .fetch(`/api/cohort/${this.state.id}/details`, "get")
      .then(res => {
        if (res.data.cohort[0].status !== "active") {
          this.setState({
            status: true,
            oldStatus: true
          });
        }
        this.setState({
          oldname: res.data.cohort[0].name,
          name: res.data.cohort[0].name,
          password: res.data.cohort[0].password
        });
        setTimeout(() => {
          this.setState({ loader: false });
        }, 1000);
      })
      .catch(err => {
        window.location.href = "../404";
      });

    api
      .fetch(`/api/fetchCoMentor/${this.state.id}`, "get")
      .then(data => {
        this.setState({ coMentor: data.data });
      })
      .catch(err => {
        window.location.href = "../404";
      });

    api
      .fetch(`/api/${this.state.id}/fetchCohorts`, "get")
      .then(data => {
        this.setState({ cohortDetails: data.data });

        api
          .fetch(`/api/fetchMentors/${data.data[0].mentor_id}`, "get")
          .then(data => {
            this.setState({ mentors: data.data });
          })
          .catch(err => {
            window.location.href = "../404";
          });
        api
          .fetch(
            `/api/availableMentor/${this.state.id}/${data.data[0].mentor_id}`,
            "get"
          )
          .then(data => {
            this.setState({ availableMentor: data.data });
          })
          .catch(err => {
            window.location.href = "../404";
          });
      })
      .catch(err => {
        window.location.href = "../404";
      });
  }

  remount = () => {
    this.setState({
      loaderTab: true
    });
    this.componentDidMount();
    setTimeout(() => {
      this.setState({ loaderTab: false });
    }, 1000);
  };

  //NAVIGATION
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClickShowOldPassword = () => {
    this.setState({ showOldPassword: !this.state.showOldPassword });
  };

  handleClickShowNewPassword = () => {
    this.setState({ showNewPassword: !this.state.showNewPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  delete = (id, classHeader) => {
    api.fetch(`/api/cohorts/${id}/delete`, "post").then(() => {
      // Create a reference to the file to delete
      if (classHeader !== null) {
        var filename = classHeader.split("/");
        S3FileUpload.deleteFile(filename[6], config)
          .then(response => {
            window.location.href = `/cohorts`;
          })
          .catch(err => console.error(err));
      } else {
        window.location.href = `/cohorts`;
      }
    });
  };

  openModal = () => {
    this.setState({
      modal: true
    });
  };

  closeModal = () => {
    this.setState({
      modal: false
    });
  };

  openACM = () => {
    this.setState({
      modalAddMentor: true
    });
  };

  closeACM = () => {
    this.setState({
      modalAddMentor: false
    });
  };

  handleNameChange = e => {
    if (e.target.value !== "") {
      this.setState({
        errorNewName: false
      });
    } else {
      this.setState({
        errorNewName: true
      });
    }
    this.setState({
      name: e.target.value
    });
  };

  checkNewNameBlur = e => {
    if (e.target.value === "") {
      this.setState({
        errorNewName: true
      });
    }
  };

  checkOldPass = e => {
    if (e.target.value !== "") {
      this.setState({
        errorOldPass: false
      });
    } else {
      this.setState({
        errorOldPass: true
      });
    }
    this.setState({
      oldpassword: e.target.value
    });
  };

  onFocusToNewPass = () => {
    if (this.state.oldpassword !== this.state.password) {
      this.setState({
        passwordMatch: false
      });
    } else {
      this.setState({
        passwordMatch: true
      });
    }
  };

  checkOldPassBlur = e => {
    if (e.target.value === "") {
      this.setState({
        errorOldPass: true
      });
    }
    if (this.state.oldpassword !== this.state.password) {
      this.setState({
        passwordMatch: false
      });
    } else {
      this.setState({
        passwordMatch: true
      });
    }
  };

  checkNewPass = e => {
    if (e.target.value !== "") {
      this.setState({
        errorNewPass: false
      });
    } else {
      this.setState({
        errorNewPass: true
      });
    }
    this.setState({
      newpassword: e.target.value
    });
  };

  checkNewPassBlur = e => {
    if (e.target.value === "") {
      this.setState({
        errorNewPass: true
      });
    }
  };

  submit = (name, oldpassword, newpassword, status) => {
    if (status !== true) {
      status = "active";
    } else {
      status = "nonactive";
    }
    if (name && oldpassword && newpassword) {
      const state = {
        name,
        newpassword,
        status
      };
      if (oldpassword !== this.state.password) {
        toast.error("Wrong Old Password!", {
          hideProgressBar: true,
          draggable: false
        });
      } else {
        api
          .fetch(`/api/cohort/${this.state.id}/editDetails`, "post", state)
          .then(() => {
            window.location.href = `/cohorts`;
          });
      }
    } else if (name) {
      const newpassword = this.state.password;
      const state = {
        name,
        newpassword,
        status
      };
      api
        .fetch(`/api/cohort/${this.state.id}/editDetails`, "post", state)
        .then(() => {
          window.location.href = `/cohorts`;
        });
    } else {
      toast.error("Please fill up all the necessary fields!", {
        hideProgressBar: true,
        draggable: false
      });
    }
  };

  handleChangeTab = (event, newValue) => {
    this.setState({
      tab: newValue
    });
  };

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
          {this.state.loader ? (
            <Loader content="Loading Details..." />
          ) : (
            <React.Fragment>
              <div className={classes.drawerHeader} />
              <Paper className={classes.mainContent}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Cohort Settings
                </Typography>
                <Divider className={classes.divider} />
                {this.state.loaderTab === true ? (
                  <Loader content="Loading details..." />
                ) : (
                  <div className={classes.vTab}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={this.state.tab}
                      onChange={this.handleChangeTab}
                      aria-label="Vertical tabs example"
                      className={classes.tabs}
                    >
                      <Tab label="Cohort Name" {...a11yProps(0)} />
                      <Tab label="Cohort Password" {...a11yProps(1)} />
                      <Tab label="Co-Mentor" {...a11yProps(2)} />
                      <Tab label="Delete Cohort" {...a11yProps(3)} />
                    </Tabs>

                    {/* COHORT NAME START */}
                    <TabPanel
                      value={this.state.tab}
                      index={0}
                      className={classes.tabPanel}
                    >
                      <Grid container className={classes.itemSettings}>
                        <Grid item xs={12} sm={5}>
                          <Typography variant="h6" className={classes.name}>
                            New cohort name
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={7}
                          className={classes.responsive}
                        >
                          <TextField
                            id="outlined-name"
                            label="Cohort Name"
                            name="name"
                            className={classes.textField}
                            InputLabelProps={{
                              classes: { outlined: classes.label }
                            }}
                            InputProps={{ classes: { root: classes.input } }}
                            fullWidth
                            defaultValue={this.state.name}
                            margin="normal"
                            variant="outlined"
                            onKeyUp={this.handleNameChange}
                            error={this.state.errorNewName}
                            helperText={
                              this.state.errorNewName ? "Name is required" : " "
                            }
                            onBlur={this.checkNewNameBlur}
                          />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                          <Typography variant="h6" className={classes.name}>
                            Lock this Cohort
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={2}
                          className={classes.responsive}
                        >
                          <Switch
                            checked={this.state.status}
                            value={this.state.status}
                            onClick={() => {
                              this.setState({
                                status: !this.state.status
                              });
                            }}
                            color="primary"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container className={classes.settingsBtn}>
                        <Button
                          variant="contained"
                          size="small"
                          className={classes.button}
                          onClick={() => (window.location.href = `/cohorts`)}
                        >
                          cancel
                        </Button>
                        {this.state.name !== this.state.oldname ||
                        this.state.newpassword !== "" ||
                        this.state.status !== this.state.oldStatus ? (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            onClick={() => {
                              this.submit(
                                this.state.name,
                                this.state.oldpassword,
                                this.state.newpassword,
                                this.state.status
                              );
                            }}
                          >
                            save
                          </Button>
                        ) : null}
                      </Grid>
                    </TabPanel>
                    {/* COHORT NAME END */}

                    {/* COHORT PASSWORD START */}
                    <TabPanel
                      value={this.state.tab}
                      index={1}
                      className={classes.tabPanel}
                    >
                      {/* COHORT PASSWORD START */}
                      <Grid container className={classes.itemSettings}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" className={classes.name}>
                            Enter old password:
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={8}
                          className={classes.responsive}
                        >
                          <TextField
                            id="outlined-adornment-oldpassword"
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                            type={
                              this.state.showOldPassword ? "text" : "password"
                            }
                            label="Old Password"
                            InputLabelProps={{
                              classes: { outlined: classes.label }
                            }}
                            name="oldpassword"
                            defaultValue={this.state.oldpassword}
                            onChange={this.checkOldPass}
                            error={
                              this.state.errorOldPass ||
                              !this.state.passwordMatch
                            }
                            helperText={
                              this.state.errorOldPass
                                ? "Old password is required!"
                                : !this.state.passwordMatch
                                ? "Old password is incorrect!"
                                : " "
                            }
                            onBlur={this.checkOldPassBlur}
                            InputProps={{
                              classes: { root: classes.input },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    onClick={this.handleClickShowOldPassword}
                                    onMouseDown={this.handleMouseDownPassword}
                                  >
                                    {this.state.showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        className={classes.itemSettings}
                        style={{ marginTop: "1%" }}
                      >
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" className={classes.name}>
                            Enter new password:
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={8}
                          className={classes.responsive}
                        >
                          <TextField
                            id="outlined-adornment-newpassword"
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                            type={
                              this.state.showNewPassword ? "text" : "password"
                            }
                            label="New Password"
                            InputLabelProps={{
                              classes: { outlined: classes.label }
                            }}
                            name="newpassword"
                            defaultValue={this.state.newpassword}
                            onKeyUp={this.checkNewPass}
                            error={this.state.errorNewPass}
                            helperText={
                              this.state.errorNewPass
                                ? "New password is required!"
                                : " "
                            }
                            onBlur={this.checkNewPassBlur}
                            onFocus={this.onFocusToNewPass}
                            InputProps={{
                              classes: { root: classes.input },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    onClick={this.handleClickShowNewPassword}
                                    onMouseDown={this.handleMouseDownPassword}
                                  >
                                    {this.state.showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container className={classes.settingsBtn}>
                        <Button
                          variant="contained"
                          size="small"
                          className={classes.button}
                          onClick={() => (window.location.href = `/cohorts`)}
                        >
                          cancel
                        </Button>
                        {this.state.name !== this.state.oldname ||
                        (this.state.newpassword !== "" &&
                          this.state.passwordMatch) ||
                        this.state.status !== this.state.oldStatus ? (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            onClick={() => {
                              this.submit(
                                this.state.name,
                                this.state.oldpassword,
                                this.state.newpassword,
                                this.state.status
                              );
                            }}
                          >
                            save
                          </Button>
                        ) : null}
                      </Grid>
                      {/* COHORT PASSWORD END */}
                    </TabPanel>
                    {/* COHORT PASSWORD END */}

                    <TabPanel
                      value={this.state.tab}
                      index={2}
                      className={classes.tabPanel}
                    >
                      {/* ADD CO-MENTOR START */}
                      <span style={{ marginLeft: "10px" }}>CO-MENTOR</span>
                      <List>
                        {this.state.coMentor.map(row => {
                          return (
                            <React.Fragment key={row.id}>
                              <ListItem
                                alignItems="center"
                                className={classes.listItem}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    className={classes.avatar}
                                    alt={`${row.id}`}
                                    src={`${row.avatar}`}
                                  />
                                </ListItemAvatar>
                                <ListItemText>
                                  <Typography className={classes.list}>
                                    {`${row.first_name} ${row.last_name}`}
                                  </Typography>
                                </ListItemText>
                              </ListItem>
                            </React.Fragment>
                          );
                        })}
                        <ListItem
                          alignItems="center"
                          className={classes.listItem}
                        >
                          <ListItemAvatar
                            onClick={() => {
                              this.openACM();
                            }}
                          >
                            <Fab
                              className={classes.fab}
                              size="small"
                              color="primary"
                              aria-label="add"
                            >
                              <AddIcon className={classes.addIcon} />
                            </Fab>
                          </ListItemAvatar>
                          <ListItemText>
                            <Typography className={classes.list}>
                              {`ADD CO-MENTOR`}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      </List>
                      {/*ADD CO-MENTOR END */}
                    </TabPanel>
                    <TabPanel
                      value={this.state.tab}
                      index={3}
                      className={classes.tabPanel}
                    >
                      {/* DELETE COHORT START */}
                      <Grid item xs={12} sm={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          <b style={{ color: "red", letterSpacing: 5 }}>
                            WARNING:{" "}
                          </b>
                          This will delete the cohort along with its contents.
                          This proccess is <b>irreversible</b>.
                        </Typography>
                      </Grid>

                      <Grid container className={classes.settingsBtn}>
                        <Button
                          variant="contained"
                          size="small"
                          className={classes.button}
                          onClick={() => (window.location.href = `/cohorts`)}
                        >
                          cancel
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          className={classes.deleteBtn}
                          onClick={() => {
                            this.openModal();
                          }}
                        >
                          delete
                        </Button>
                      </Grid>
                      {/*DELETE COHORT END */}
                    </TabPanel>
                  </div>
                )}
              </Paper>
            </React.Fragment>
          )}
          <ToastContainer
            enableMultiContainer
            position={toast.POSITION.TOP_RIGHT}
          />
          <DeleteClass
            open={this.state.modal}
            close={this.closeModal}
            id={this.state.id}
            classHeader={
              this.state.cohortDetails.length !== 0
                ? this.state.cohortDetails[0].class_header
                : null
            }
            delete={this.delete}
          />
          <AddCoMentor
            open={this.state.modalAddMentor}
            close={this.closeACM}
            mentors={this.state.mentors}
            coMentor={this.state.coMentor}
            cohortDetails={this.state.cohortDetails}
            mount={this.remount}
            availableMentor={this.state.availableMentor}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
