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
import { Grid } from "semantic-ui-react";

const styles = theme => ({
  card: {
    height: 250,
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
    top: 52,
    right: 14,
    height: 60,
    width: 60
  },
  class: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

class AvailClass extends React.Component {
  render() {
    const {
      classes,
      cohorts,
      openEnroll,
      openLeave,
      openStudentList
    } = this.props;

    return (
      <React.Fragment>
        {this.props.enrolledClasses.length !== 0
          ? cohorts.map(cohort => {
              var unique = true;
              this.props.enrolledClasses.map(classes => {
                if (cohort.id === classes.id) {
                  unique = false;
                }
                return null;
              });

              if (unique === true) {
                if (this.props.search) {
                  if (
                    cohort.name
                      .toLowerCase()
                      .includes(this.props.search.toLowerCase())
                  ) {
                    return (
                      <Grid xs={3} key={cohort.id}>
                        <Card className={classes.card}>
                          <CardActionArea
                            id={cohort.id}
                            onClick={e => openEnroll(e, cohort.id)}
                            name="enroll"
                            className={classes.wholeCardContainer}
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
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="h2"
                                >
                                  {cohort.name}
                                </Typography>
                                <Avatar
                                  alt={
                                    cohort.first_name + " " + cohort.last_name
                                  }
                                  src={cohort.avatar}
                                  className={classes.bigAvatar}
                                />
                              </div>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                Mentor:{" "}
                                {cohort.first_name + " " + cohort.last_name}
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
                          </CardActions>
                          }
                        </Card>
                      </Grid>
                    );
                  }
                } else {
                  return (
                    <Grid xs={3} key={cohort.id}>
                      <Card className={classes.card}>
                        <CardActionArea
                          id={cohort.id}
                          onClick={e => openEnroll(e, cohort.id)}
                          name="enroll"
                          className={classes.wholeCardContainer}
                        >
                          <CardMedia
                            className={classes.media}
                            image={
                              cohort.class_header === null
                                ? DefaultBackground
                                : cohort.class_header
                            }
                            title={cohort.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end"
                            }}
                          >
                            <Avatar
                              alt={cohort.first_name + "s " + cohort.last_name}
                              src={cohort.avatar}
                              className={classes.bigAvatar}
                            />
                          </CardMedia>
                          <CardContent className={classes.cardContent}>
                            <div className={classes.class}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                {cohort.name}
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Mentor:{" "}
                              {cohort.first_name + " " + cohort.last_name}
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
                        </CardActions>
                        }
                      </Card>
                    </Grid>
                  );
                }
              }
              return null;
            })
          : cohorts.map(cohort => {
              if (this.props.search) {
                if (
                  cohort.name
                    .toLowerCase()
                    .includes(this.props.search.toLowerCase())
                ) {
                  return (
                    <Grid xs={3} key={cohort.id}>
                      <Card className={classes.card}>
                        <CardActionArea
                          id={cohort.id}
                          onClick={e => openEnroll(e, cohort.id)}
                          name="enroll"
                          className={classes.wholeCardContainer}
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
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                {cohort.name}
                              </Typography>
                              <Avatar
                                alt={
                                  cohort.first_name + "s " + cohort.last_name
                                }
                                src={cohort.avatar}
                                className={classes.bigAvatar}
                              />
                            </div>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              Mentor:{" "}
                              {cohort.first_name + " " + cohort.last_name}
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
                        </CardActions>
                        }
                      </Card>
                    </Grid>
                  );
                }
              } else {
                return (
                  <Grid xs={3} key={cohort.id}>
                    <Card className={classes.card}>
                      <CardActionArea
                        id={cohort.id}
                        onClick={e => openEnroll(e, cohort.id)}
                        name="enroll"
                        className={classes.wholeCardContainer}
                      >
                        <CardMedia
                          className={classes.media}
                          image={
                            cohort.class_header === null
                              ? DefaultBackground
                              : cohort.class_header
                          }
                          title={cohort.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                          }}
                        >
                          <div>
                            <Avatar
                              alt={cohort.first_name + " " + cohort.last_name}
                              src={cohort.avatar}
                              className={classes.bigAvatar}
                            />
                          </div>
                        </CardMedia>
                        <CardContent className={classes.cardContent}>
                          <div className={classes.class}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {cohort.name}
                            </Typography>
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
                      </CardActions>
                    </Card>
                  </Grid>
                );
              }
              return null;
            })}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AvailClass);
