import React from "react";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import api from "../../../services/fetchApi";

const styles = theme => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  scroll: {
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#ececec",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  }
});

class StudentList extends React.Component {
  constructor() {
    super();

    this.state = {
      open: true,
      students: []
    };
  }

  componentDidMount() {
    api.fetch(`/${this.props.cohortId}/students`, "get").then(res => {
      this.setState({ students: res.data.students });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <DialogTitle id="scroll-dialog-title">Students</DialogTitle>
        <DialogContent dividers={true} classes={{ root: classes.scroll }}>
          {this.state.students.map((student, i) => (
            <List
              dense={true}
              className={classes.list}
              key={i}
              style={{
                borderBottom: "1px solid gainsboro"
              }}
            >
              <ListItem button>
                <ListItemAvatar>
                  <Avatar
                    alt={student.first_name + " " + student.last_name}
                    src={student.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={student.first_name + " " + student.last_name}
                />
              </ListItem>
            </List>
          ))}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.close}>
            Close
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(StudentList);
