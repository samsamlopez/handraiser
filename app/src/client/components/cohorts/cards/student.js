import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

import DefaultBackground from "../../../images/classroomBg.jpg";
import History from "./history/history";
//API
import api from "../../../services/fetchApi";
import { Grid } from "semantic-ui-react";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  card: {
    height: 275,
    width: 300,
    "@media: (max-width: 425px)": {
      margin: "16px 0"
    },
    margin: theme.spacing(2)
  },
  wholeCardContainer: {
    height: "100%",
    width: 300,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  cardContainer: {
    height: 225,
    width: 300,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  cardContent: {
    height: "55%",
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  buttonContainer: {
    height: 50,
    paddingTop: 0,
    paddingBottom: 0
  },
  media: {
    height: "45%",
    width: 300,
    backgroundColor: "#775aa5"
  },
  bigAvatar: {
    position: "absolute",
    top: 43,
    right: 14,
    height: 60,
    width: 60
  },
  class: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logBtn: {
    marginLeft: "auto"
  }
});

class StudentClassCards extends React.Component {
  constructor() {
    super();
    this.state = {
      openHistory: false,
      history: [],
      selectedCohort: []
    };
  }
  openHistory = cohort => {
    api
      .fetch(`/api/history/${cohort.id}/${this.props.user_id}`, "get")
      .then(res => {
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
      openEnroll,
      openLeave,
      openStudentList,
      members
    } = this.props;
    return (
      <React.Fragment>
        {cohorts.map(cohort => {
          if (this.props.search) {
            if (
              cohort.name
                .toLowerCase()
                .includes(this.props.search.toLowerCase())
            ) {
              return members.filter(
                member =>
                  member.cohort_id === cohort.id &&
                  member.student_id === this.props.user_id
              ).length !== 0 ? (
                <Grid item lg={4} xs={12} key={cohort.id}>
                  <Card className={classes.card}>
                    <CardActionArea
                      id={cohort.id}
                      onClick={e => openEnroll(e, cohort.id)}
                      name="goToClass"
                      className={classes.cardContainer}
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
                        <div className={classes.class}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {cohort.name}
                          </Typography>
                          <Avatar
                            alt={cohort.first_name + " " + cohort.last_name}
                            src={cohort.avatar}
                            className={classes.bigAvatar}
                          />
                        </div>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Mentor: {cohort.first_name + " " + cohort.last_name}
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
                        onClick={openLeave}
                      >
                        Leave
                      </Button>
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
                      <Button
                        size="small"
                        className={classes.logBtn}
                        color="primary"
                        id={cohort.id}
                        onClick={() => this.openHistory(cohort)}
                      >
                        My Logs
                      </Button>
                    </CardActions>
                    }
                  </Card>
                </Grid>
              ) : null;
            }
          } else {
            return members.filter(
              member =>
                member.cohort_id === cohort.id &&
                member.student_id === this.props.user_id
            ).length !== 0 ? (
              <Grid xs={3} key={cohort.id}>
                <Card className={classes.card}>
                  <CardActionArea
                    id={cohort.id}
                    onClick={e => openEnroll(e, cohort.id)}
                    name="goToClass"
                    className={classes.cardContainer}
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
                      <div className={classes.class}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {cohort.name}
                        </Typography>
                        <Avatar
                          alt={cohort.first_name + " " + cohort.last_name}
                          src={cohort.avatar}
                          className={classes.bigAvatar}
                        />
                      </div>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Mentor: {cohort.first_name + " " + cohort.last_name}
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
                  <Divider />
                  <CardActions className={classes.buttonContainer}>
                    <Button
                      size="small"
                      color="primary"
                      id={cohort.id}
                      onClick={openLeave}
                    >
                      Leave
                    </Button>
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
                    <Button
                      size="small"
                      className={classes.logBtn}
                      color="primary"
                      id={cohort.id}
                      onClick={() => this.openHistory(cohort)}
                    >
                      My Logs
                    </Button>
                  </CardActions>
                  }
                </Card>
              </Grid>
            ) : null;
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

export default withStyles(styles)(StudentClassCards);
