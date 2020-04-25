import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Handraise from "@material-ui/icons/PanTool";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import Chip from "@material-ui/core/Chip";
import ClassIcon from "@material-ui/icons/Group";
import History from "../cohorts/cards/history/history";
import UploadPhoto from "../common-components/upload-photo/UploadPhoto";
import ClassList from "../cohorts/modals/classList/classList";

import api from "../../services/fetchApi";

const styles = theme => ({
  raiseBtn: {
    backgroundColor: "#983cac",
    "&:hover": {
      backgroundColor: "#780aaf"
    },
    "@media (max-width: 599px)": {
      display: "none"
    }
  },
  raiseHand: {
    cursor: "pointer",
    fontSize: "35px",
    "@media (min-width: 600px)": {
      display: "none"
    }
  },
  userAvatar: {
    width: 56,
    height: 56,
    marginRight: 6,
    "@media (max-width: 425px)": {
      width: 35,
      height: 35,
      marginLeft: -15
    }
  },
  responsiveHeader: {
    "@media (max-width: 425px)": {
      fontSize: "16px",
      marginLeft: -25
    }
  },
  responsive: {
    marginRight: -12,
    "@media (max-width: 425px)": {
      fontSize: "17px"
    }
  },
  btnDisabled: {
    "&.Mui-disabled": {
      backgroundColor: "rgba(255, 255, 255, 0.46)"
    }
  },

  breadcrumbNav: {
    marginTop: "13px",
    display: "flex",
    justifyContent: "center"
  },
  chip: {
    margin: theme.spacing(0.4),
    color: "white",
    background: "none",
    border: "1px solid white",
    "&:hover, &:focus": {
      background: "white",
      color: "#565656"
    }
  },
  fullScreen: {
    "@media (max-width: 767px)": {
      width: "100%",
      height: "100%",
      margin: "0",
      maxWidth: "100%",
      maxHeight: "none",
      borderRadius: "0"
    }
  },
  linkUpload: {
    color: "#f3f3f3",
    fontSize: "13px",
    cursor: "pointer",
    "@media (max-width: 425px)": {
      fontSize: "9px"
    }
  },
  linkSetToDefault: {
    color: "#f3f3f3",
    fontSize: "13px",
    textDecoration: "underline",
    cursor: "pointer",
    "@media (max-width: 425px)": {
      fontSize: "9px"
    }
  }
});

class StudentHeader extends Component {
  constructor() {
    super();

    this._isMounted = false;

    this.state = {
      uploadPhotoDialog: false,
      uploadPhotoLoader: false,
      classHeaderImage: null,

      history: [],
      cohort: [],
      openHistory: false,
      openClassList: false,
      students: []
    };
  }

  onDrop = picture => {
    this.setState({
      pictures: this.state.pictures.concat(picture)
    });
  };

  openHistory = () => {
    api
      .fetch(`/api/history/${this.props.cohortId}/${this.props.user.id}`, "get")
      .then(res => {
        api
          .fetch(`/api/cohort/${this.props.cohortId}/details`, "get")
          .then(response => {
            this.setState({
              openHistory: true,
              history: res.data.history,
              cohort: response.data.cohort[0]
            });
          });
      });
  };

  openClassList = () => {
    api
      .fetch(`/api/cohorts/${this.props.cohortId}/students`, "get")
      .then(res => {
        api
          .fetch(`/api/cohort/${this.props.cohortId}/details`, "get")
          .then(response => {
            this.setState({
              openClassList: true,
              students: res.data.students,
              cohort: response.data.cohort[0]
            });
          });
      });
  };

  handleCloseHistory = () => {
    this.setState({
      openHistory: false
    });
  };

  handleCloseClassList = () => {
    this.setState({
      openClassList: false
    });
  };
  uploadPhoto = () => {
    this.setState({ uploadPhotoLoader: !this.state.uploadPhotoLoader });
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Box item="true" xs={12} sm={12}>
          <Typography
            variant="h5"
            component="h3"
            align="center"
            className={classes.responsive}
            style={{ color: "whitesmoke" }}
          >
            {this.props.user.name.charAt(0).toUpperCase() +
              this.props.user.name.slice(1)}
          </Typography>
          <ListItem style={{ height: "125px" }}>
            <ListItemAvatar>
              <Avatar
                src={this.props.user.avatar}
                className={classes.userAvatar}
              />
            </ListItemAvatar>
            {this.props.privilege === "student" ? (
              <ListItemText>
                <Typography
                  variant="h6"
                  component="h3"
                  className={classes.responsiveHeader}
                  style={{ color: "whitesmoke", marginLeft: 7 }}
                >
                  {this.props.user.first_name.charAt(0).toUpperCase() +
                    this.props.user.first_name.slice(1)}{" "}
                  {this.props.user.last_name.charAt(0).toUpperCase() +
                    this.props.user.last_name.slice(1)}
                </Typography>
                <Chip
                  className={classes.chip}
                  size="small"
                  avatar={
                    <Avatar style={{ background: "white" }}>
                      <ClassIcon />
                    </Avatar>
                  }
                  label="Students"
                  onClick={this.openClassList}
                />
                <Chip
                  className={classes.chip}
                  size="small"
                  label="My Activities"
                  onClick={this.openHistory}
                />
              </ListItemText>
            ) : (
              <ListItemText>
                <Typography
                  variant="h6"
                  component="h3"
                  className={classes.responsiveHeader}
                  style={{ color: "whitesmoke" }}
                >
                  {this.props.user.first_name.charAt(0).toUpperCase() +
                    this.props.user.first_name.slice(1)}{" "}
                  {this.props.user.last_name.charAt(0).toUpperCase() +
                    this.props.user.last_name.slice(1)}
                </Typography>
              </ListItemText>
            )}

            {this.props.privilege === "student" ? (
              <div>
                <Tooltip title="Send Raise" placement="top">
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.raiseBtn}
                      disabled={this.props.btn}
                      onClick={this.props.requestHelp}
                      classes={{ contained: classes.btnDisabled }}
                    >
                      {this.props.raise}
                    </Button>
                  </div>
                </Tooltip>
                <Tooltip
                  title="Help Student"
                  placement="top"
                  className={classes.raiseHand}
                >
                  <div>
                    <IconButton
                      className={classes.responsive}
                      disabled={this.props.btn}
                      onClick={this.props.requestHelp}
                    >
                      <Handraise
                        className={classes.raiseHand}
                        style={
                          this.props.btn
                            ? { color: "#f6edff3d" }
                            : { color: "#cc98ff" }
                        }
                      />
                    </IconButton>
                  </div>
                </Tooltip>
              </div>
            ) : (
              <div style={{ marginTop: "100px" }}>
                <div>
                  <Link
                    className={classes.linkUpload}
                    onClick={() => this.setState({ uploadPhotoDialog: true })}
                  >
                    {this.state.uploadPhotoLoader
                      ? "Changing..."
                      : "Upload photo"}
                  </Link>
                </div>

                {this.props.classHeaderImage !== null ? (
                  <Link
                    className={classes.linkSetToDefault}
                    onClick={() => this.props.setToDefaultHeaderFn()}
                  >
                    Set to default
                  </Link>
                ) : null}
              </div>
            )}
          </ListItem>
        </Box>

        {/* DIALOGS */}
        <Dialog
          onClose={() => this.setState({ uploadPhotoDialog: false })}
          open={this.state.uploadPhotoDialog}
          maxWidth="md"
          fullWidth={true}
          classes={{ paper: classes.fullScreen }}
        >
          <UploadPhoto
            loadStateFn={this.props.loadStateFn}
            uploadPhotoFn={this.uploadPhoto}
            handleClose={() => this.setState({ uploadPhotoDialog: false })}
            cohortId={this.props.cohortId}
          />
        </Dialog>

        <History
          open={this.state.openHistory}
          cohort={this.state.cohort}
          handleClose={this.handleCloseHistory}
          history={this.state.history}
        />
        <ClassList
          open={this.state.openClassList}
          cohort={this.state.cohort}
          handleClose={this.handleCloseClassList}
          students={this.state.students}
        />
      </div>
    );
  }
}

export default withStyles(styles)(StudentHeader);
