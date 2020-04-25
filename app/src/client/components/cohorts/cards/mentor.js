import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import LockIcon from "@material-ui/icons/Lock";
import DefaultBackground from "../../../images/cardBg.jpg";
import History from "./history/history";
//API
import api from "../../../services/fetchApi";

const styles = theme => ({
  card: {
    height: 275,
    width: 300,
    "@media: (max-width: 425px)": {
      margin: "16px 0"
    },
    margin: theme.spacing(2)
  },
  cardContainer: {
    height: 225,
    width: 300,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  buttonContainer: {
    height: 50,
    paddingTop: 0,
    paddingBottom: 0
  },
  addCardContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  cardContent: {
    height: "55%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  add: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  media: {
    height: "45%",
    width: 300,
    backgroundColor: "#775aa5"
  },
  logBtn: {
    marginLeft: "auto"
  }
});

class MentorClassCards extends React.Component {
  constructor() {
    super();
    this.state = {
      openHistory: false,
      history: [],
      selectedCohort: []
    };
  }

  openHistory = cohort => {
    api.fetch(`/api/history/${cohort.id}`, "get").then(res => {
      this.setState({
        openHistory: true,
        history: res.data.history,
        selectedCohort: cohort
      });
    });
  };

  handleCloseHistory = () => {
    this.setState({
      openHistory: false
    });
  };

  render() {
    const {
      classes,
      cohorts,
      openAdd,
      openStudentList,
      redirect,
      search,
      subCohorts
    } = this.props;
    return (
      <React.Fragment>
        {search !== "" ? null : (
          <Card className={classes.card}>
            <Tooltip title="Add new class" placement="left">
              <CardActionArea
                className={classes.addCardContainer}
                onClick={openAdd}
              >
                <CardContent>
                  <div className={classes.add}>
                    <AddIcon />
                  </div>
                </CardContent>
              </CardActionArea>
            </Tooltip>
          </Card>
        )}
        {cohorts.map(cohort => {
          if (cohort.mentor_id === this.props.user.id) {
            if (search) {
              if (cohort.name.toLowerCase().includes(search.toLowerCase())) {
                return (
                  <Card className={classes.card} key={cohort.id}>
                    <CardActionArea
                      className={classes.cardContainer}
                      onClick={() => redirect(cohort.id)}
                    >
                      <CardMedia
                        className={classes.media}
                        image={
                          cohort.class_header === null
                            ? DefaultBackground
                            : cohort.class_header
                        }
                        title={cohort.name}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {cohort.name}
                          {cohort.status === "active" ? null : (
                            <LockIcon
                              style={{ color: "#71686e", marginLeft: "8px" }}
                            />
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Password: {cohort.password}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Students: {cohort.members}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className={classes.buttonContainer}>
                      <Button
                        size="small"
                        color="primary"
                        id={cohort.id}
                        onClick={() =>
                          (window.location.href = `/settings/${cohort.id}`)
                        }
                      >
                        Settings
                      </Button>
                      {cohort.members !== "0" ? (
                        <Button
                          size="small"
                          color="primary"
                          id={cohort.id}
                          onClick={() => {
                            openStudentList(cohort.id);
                          }}
                        >
                          Students
                        </Button>
                      ) : null}
                      <Button
                        size="small"
                        className={classes.logBtn}
                        color="primary"
                        id={cohort.id}
                        onClick={() => this.openHistory(cohort)}
                      >
                        Logs
                      </Button>
                    </CardActions>
                  </Card>
                );
              }
            } else {
              return (
                <Card className={classes.card} key={cohort.id}>
                  <CardActionArea
                    className={classes.cardContainer}
                    onClick={() => redirect(cohort.id)}
                  >
                    <CardMedia
                      className={classes.media}
                      image={
                        cohort.class_header === null
                          ? DefaultBackground
                          : cohort.class_header
                      }
                      title={cohort.name}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {cohort.name}
                        {cohort.status === "active" ? null : (
                          <LockIcon
                            style={{ color: "#71686e", marginLeft: "8px" }}
                          />
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Password: {cohort.password}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Students: {cohort.members}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.buttonContainer}>
                    <Button
                      size="small"
                      color="primary"
                      id={cohort.id}
                      onClick={() =>
                        (window.location.href = `/settings/${cohort.id}`)
                      }
                    >
                      Settings
                    </Button>
                    {cohort.members !== "0" ? (
                      <Button
                        size="small"
                        color="primary"
                        id={cohort.id}
                        onClick={() => {
                          openStudentList(cohort.id);
                        }}
                      >
                        Students
                      </Button>
                    ) : null}
                    <Button
                      size="small"
                      className={classes.logBtn}
                      color="primary"
                      id={cohort.id}
                      onClick={() => this.openHistory(cohort)}
                    >
                      Logs
                    </Button>
                  </CardActions>
                </Card>
              );
            }
          } else {
            // CO-MENTORS *******************************************SAM***************************************************
            return subCohorts.map(row => {
              if (row.user_id === this.props.user.id && row.id === cohort.id) {
                if (search) {
                  if (
                    cohort.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return (
                      <Card className={classes.card} key={cohort.id}>
                        <CardActionArea
                          className={classes.cardContainer}
                          onClick={() => redirect(cohort.id)}
                        >
                          <CardMedia
                            className={classes.media}
                            image={
                              cohort.class_header === null
                                ? DefaultBackground
                                : cohort.class_header
                            }
                            title={cohort.name}
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {cohort.name}
                              {cohort.status === "active" ? null : (
                                <LockIcon
                                  style={{
                                    color: "#71686e",
                                    marginLeft: "8px"
                                  }}
                                />
                              )}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Password: {cohort.password}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Students: {cohort.members}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions className={classes.buttonContainer}>
                          {cohort.members !== "0" ? (
                            <Button
                              size="small"
                              color="primary"
                              id={cohort.id}
                              onClick={() => {
                                openStudentList(cohort.id);
                              }}
                            >
                              Students
                            </Button>
                          ) : null}
                        </CardActions>
                      </Card>
                    );
                  }
                } else {
                  return (
                    <Card className={classes.card} key={cohort.id}>
                      <CardActionArea
                        className={classes.cardContainer}
                        onClick={() => redirect(cohort.id)}
                      >
                        <CardMedia
                          className={classes.media}
                          image={
                            cohort.class_header === null
                              ? DefaultBackground
                              : cohort.class_header
                          }
                          title={cohort.name}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {cohort.name}
                            {cohort.status === "active" ? null : (
                              <LockIcon
                                style={{ color: "#71686e", marginLeft: "8px" }}
                              />
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Password: {cohort.password}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Students: {cohort.members}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions className={classes.buttonContainer}>
                        {cohort.members !== "0" ? (
                          <Button
                            size="small"
                            color="primary"
                            id={cohort.id}
                            onClick={() => {
                              openStudentList(cohort.id);
                            }}
                          >
                            Students
                          </Button>
                        ) : null}
                      </CardActions>
                    </Card>
                  );
                }
              }
              return null;
            });
          }
          return null;
        })}

        <History
          open={this.state.openHistory}
          cohort={this.state.selectedCohort}
          handleClose={this.handleCloseHistory}
          history={this.state.history}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MentorClassCards);
