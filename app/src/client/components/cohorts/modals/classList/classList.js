import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Typography, Grid, withWidth, List, ListItem, ListItemAvatar,ListItemText,ListItemSecondaryAction,Avatar
} from '@material-ui/core';
import Transition from './transition'
import EmptyQueue from "../../../../images/emptyqueue.svg";
import PersonIcon from "@material-ui/icons/Person";

const styles = theme => ({
  title: {
    paddingTop: 35,
    minHeight: 50,
    backgroundColor: '#780aaf',
    color: 'white',
    textAlign: 'center'
  },
  emptyQueue: {
    marginTop: 45,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    "@media (max-width: 425px)": {
      marginTop: 160
    }
  },
  subtitle: {
    marginTop: 20
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class ClassList extends React.Component {
  render() {
    const {
      width,
      classes,
      open,
      cohort,
      handleClose,
      students
    } = this.props;
    return (
      <Dialog
        maxWidth="xs"
        fullWidth
        fullScreen={width === 'xs' ? true : false}
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h4">{cohort.name || ' '}</Typography>
          <Typography variant="overline">Students</Typography>
        </DialogTitle>
        <DialogContent>
          {students.length > 0 ?
            students.map((student, index) => {
              return (<List
                className={classes.list}
                key={student.id}
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
                  <ListItemSecondaryAction>
                    <PersonIcon />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>)

            })

            :
            <Grid container className={classes.emptyQueue}>
              <img src={EmptyQueue} alt="img" width="280" height="250" />
              <Typography className={classes.subtitle} variant="overline" color="textSecondary">
                Nothing here...
                </Typography>
            </Grid>

          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
                </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withWidth()(withStyles(styles)(ClassList));
