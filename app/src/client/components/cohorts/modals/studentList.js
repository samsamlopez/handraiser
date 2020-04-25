import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import TrashIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class StudentList extends React.Component {
  render() {
    const {
      classes,
      students,
      close,
      open,
      scroll,
      id,
      privilege
    } = this.props;
    return (
      <Dialog
        open={open}
        onClose={close}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="scroll-dialog-title">Students</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          {students.map((student, index) => (
            <List
              className={classes.list}
              key={student.student_id}
              style={students.length === 1 || index === students.length - 1 ? {} : { borderBottom: "1px solid gainsboro" }}
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
                {student.student_id === id ? (
                  <ListItemSecondaryAction>
                    <PersonIcon />
                  </ListItemSecondaryAction>
                ) : privilege === "mentor" ? (
                  <ListItemSecondaryAction
                    onClick={() =>
                      this.props.removeStudent(
                        student.cohort_id,
                        student.student_id
                      )
                    }
                  >
                    <Button>
                      <TrashIcon />
                    </Button>
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
            </List>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(StudentList);
