import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  leftNav: {
    // padding: theme.spacing(2, 3),
    maxWidth: "auto",
    maxHeigth: "98px",
    minHeight: "304px",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)"
  },
  list: {
    maxHeight: "52px"
  },
  userAvatar: {
    width: 35,
    height: 35,
    "@media (max-width: 425px)": {
      width: 29,
      height: 29,
      marginLeft: -15
    }
  },
  queueName: {
    fontSize: "17px",
    "@media (max-width: 425px)": {
      fontSize: "14px",
      marginLeft: -24
    }
  },
  responsiveHeader: {
    "@media (max-width: 425px)": {
      fontSize: "17px"
    }
  },
  helpHeader: {
    background: "#775aa5",
    color: "white",
    padding: theme.spacing(2, 3),
    borderRadius: "4px 4px 0 0",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)"
  },
  scrollBar: {
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  }
});

class BeingHelped extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.leftNav}>
          <div className={classes.helpHeader}>
            <Typography
              variant="h6"
              align="center"
              className={classes.responsiveHeader}
            >
              Being Helped ({this.props.currentlyHelping.length})
            </Typography>
          </div>
          <div
            className={classes.scrollBar}
            style={{ height: 240, overflowY: "auto" }}
          >
            {this.props.currentlyHelping.length > 0 ? (
              this.props.currentlyHelping.map(helpingStudent => {
                return (
                  <React.Fragment key={helpingStudent.avatar}>

                    <List>
                      <ListItem className={classes.list}>
                        <ListItemAvatar>
                          <Avatar
                            src={helpingStudent.avatar}
                            className={classes.userAvatar}
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography>
                            {helpingStudent.first_name.charAt(0).toUpperCase() +
                              helpingStudent.first_name.slice(1)}{" "}
                            {helpingStudent.last_name.charAt(0).toUpperCase() +
                              helpingStudent.last_name.slice(1)}
                          </Typography>
                        </ListItemText>
                        {/* <Divider /> */}
                      </ListItem>
                      <Divider />
                    </List>

                  </React.Fragment>
                );
              })
            ) : (
                <React.Fragment>
                  <ListItem className={classes.list}>
                    <ListItemText>
                      <Typography
                        style={{
                          color: "#9e9e9e",
                          textAlign: "center",
                          marginTop: 40
                        }}
                      >
                        {"None"}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </React.Fragment>
              )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(BeingHelped);
