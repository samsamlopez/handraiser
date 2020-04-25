import React from "react";
import rand from "random-key";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CopyIcon from "@material-ui/icons/FileCopy";
import Typography from "@material-ui/core/Typography";

import TableLoader from "../common-components/table/loader";
import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";
import Auth from "../../auth/auth";
import api from "../../services/fetchApi";

import styles from "./mentorKeys.component.style";
class MentorKeys extends React.Component {
  constructor() {
    super();

    this.state = {
      loader: true,
      open: true,
      generateDialog: false,
      confirmationDialog: false,
      filter: "all",
      search: "",
      keys: [],
      mentors: [],
      generatedKey: "",
      copied: false
    };
  }

  componentDidMount() {
    document.title = "Generated Keys";
    api.fetch("/keys", "get").then(res => {
      this.setState({ keys: res.data.keys });
    });

    api.fetch("/mentors", "get").then(res => {
      this.setState({ mentors: res.data.mentors });
      setTimeout(() => {
        this.setState({ loader: false });
      }, 1000);
    });
  }

  handleDrawerOpen = () => this.setState({ open: true });
  handleDrawerClose = () => this.setState({ open: false });

  openGenerateDialog = () => {
    this.setState({
      generateDialog: true,
      generatedKey: "MT-" + rand.generateBase30(6)
    });
  };
  closeGenerateDialog = () => this.setState({ generateDialog: false });

  openConfirmationDialog = () => {
    this.setState({
      confirmationDialog: true,
      generateDialog: false
    });
  };

  filterStatus = e => {
    this.setState({ loader: true });
    api.fetch(`/keys/${e.target.value}`, "get").then(res => {
      this.setState({ keys: res.data.keys });
      setTimeout(() => {
        this.setState({ loader: false });
      }, 1000);
    });
    this.setState({ filter: e.target.value });
  };

  handleSearch = e => this.setState({ search: e.target.value });

  generateKey = () => {
    api.fetch("/generate-key", "post", this.state).then(res => {
      this.setState({ confirmationDialog: false });
      api.fetch("/keys", "get").then(res => {
        this.setState({ keys: res.data.keys });
      });
      toast.info("Successfully added!", {
        hideProgressBar: true,
        draggable: false
      });
    });
  };

  getMentorName = sub => {
    let name = "";
    this.state.mentors.map(mentor => {
      if (mentor.sub === sub) name = mentor.first_name + " " + mentor.last_name;
      return name;
    });
    return name;
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
          <ToastContainer
            enableMultiContainer
            position={toast.POSITION.BOTTOM_RIGHT}
          />
          <div className={classes.drawerHeader} />
          <Grid container>
            <Grid item={true} xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="status">Filter by status</InputLabel>
                <Select
                  value={this.state.filter}
                  onChange={e => this.filterStatus(e)}
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  <MenuItem value={"used"}>used</MenuItem>
                  <MenuItem value={"available"}>available</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <Button
                style={{ float: "right" }}
                variant="contained"
                color="primary"
                onClick={this.openGenerateDialog}
              >
                Generate new key
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.paper}>
            <Card className={classes.cardContact}>
              <CardHeader
                className={classes.cardHeader}
                title="Generated Keys"
                classes={{ action: classes.actionSearch }}
                action={
                  <Grid item={true} xs={8} sm={12}>
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search by sign-in key or mentor"
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
                <TableLoader content="Loading keys..." />
              ) : (
                <div className={classes.scroll}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={classes.stickyHeader}
                        >
                          Sign-in key1
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.stickyHeader}
                        >
                          Use by
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.stickyHeader}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {this.state.keys.map((data, i) => {
                        if (this.state.search) {
                          if (
                            data.sign_in_key
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase()) ||
                            this.getMentorName(data.sub)
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase())
                          ) {
                            return (
                              <TableRow key={i} className={classes.row}>
                                <TableCell
                                  align="center"
                                  style={{
                                    color: "#8340a5",
                                    fontWeight: "bold"
                                  }}
                                >
                                  {data.sign_in_key}
                                  <Tooltip title="Copy" placement="top-start">
                                    <CopyToClipboard
                                      text={data.sign_in_key}
                                      onCopy={() =>
                                        this.setState({ copied: true })
                                      }
                                    >
                                      <IconButton
                                        style={{
                                          margin: "0 1% 1px",
                                          padding: 0
                                        }}
                                      >
                                        <CopyIcon
                                          style={{
                                            fontSize: "15px",
                                            color: "#a19ba5"
                                          }}
                                        />
                                      </IconButton>
                                    </CopyToClipboard>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                  {data.sub === null
                                    ? "---"
                                    : this.getMentorName(data.sub)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={
                                    data.sub !== null
                                      ? {
                                          color: "#000000de",
                                          fontWeight: "bold"
                                        }
                                      : {
                                          color: "green",
                                          fontWeight: "bold"
                                        }
                                  }
                                >
                                  {data.sub !== null ? "used" : "available"}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        } else {
                          return (
                            <TableRow key={i} className={classes.row}>
                              <TableCell
                                align="center"
                                style={{
                                  color: "#8340a5",
                                  fontWeight: "bold"
                                }}
                              >
                                {data.sign_in_key}
                                <Tooltip title="Copy" placement="top-start">
                                  <CopyToClipboard
                                    text={data.sign_in_key}
                                    onCopy={() =>
                                      this.setState({ copied: true })
                                    }
                                  >
                                    <IconButton
                                      style={{ margin: "0 1% 1px", padding: 0 }}
                                    >
                                      <CopyIcon
                                        style={{
                                          fontSize: "15px",
                                          color: "#a19ba5"
                                        }}
                                      />
                                    </IconButton>
                                  </CopyToClipboard>
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                {data.sub === null
                                  ? "---"
                                  : this.getMentorName(data.sub)}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={
                                  data.sub !== null
                                    ? {
                                        color: "#000000de",
                                        fontWeight: "bold"
                                      }
                                    : {
                                        color: "green",
                                        fontWeight: "bold"
                                      }
                                }
                              >
                                {data.sub !== null ? "used" : "available"}
                              </TableCell>
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

        {/* GENERATE KEY */}
        <Dialog open={this.state.generateDialog}>
          <DialogTitle id="form-dialog-title">
            <Typography gutterBottom style={{ fontSize: "17px" }}>
              {"Generate Key"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"This is your generated key"}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="key"
              type="key"
              fullWidth
              value={this.state.generatedKey}
              disabled
              InputProps={{ classes: { input: classes.inputField } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeGenerateDialog} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={this.openConfirmationDialog}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        {/* CONFIRMATION KEY */}
        <Dialog open={this.state.confirmationDialog}>
          <DialogTitle id="form-dialog-title">
            <Typography gutterBottom style={{ fontSize: "17px" }}>
              {"Are you sure you want to generate this key?"}
            </Typography>
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  confirmationDialog: false,
                  generateDialog: true
                })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button color="primary" onClick={this.generateKey}>
              Generate
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Auth(withStyles(styles)(MentorKeys));
