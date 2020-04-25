import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

import api from "../../../services/fetchApi";

const styles = theme => ({
  scroll: {
    overflow: "auto",
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
      cohorts: []
    };
  }

  componentDidMount() {
    api.fetch(`/${this.props.mentorId}/cohorts`, "get").then(res => {
      this.setState({ cohorts: res.data.cohorts });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <DialogTitle id="scroll-dialog-title">Classes</DialogTitle>
        <DialogContent dividers={true} classes={{ root: classes.scroll }}>
          {this.state.cohorts.map((cohort, i) => (
            <List
              dense={true}
              key={i}
              style={{
                borderBottom: "1px solid gainsboro",
                textAlign: "center"
              }}
            >
              <ListItemText primary={cohort.name} />
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
