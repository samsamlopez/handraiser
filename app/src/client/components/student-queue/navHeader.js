import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import History from '../cohorts/cards/history/history';
import api from "../../services/fetchApi";

export default class navHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: "",
      disabled: false,
      clearText: "",
      history: [],
      cohort: [],
      openHistory: false
    };
  }

  componentDidMount() {
    if (this.props.raise === "Waiting for help") {
      if (this.state.clearText === "") {
        this.setState({
          disabled: true,
          reason: "",
          clearText: "cleared"
        });
      }
    } else {
      if (this.props.requested) {
        if (this.state.clearText === "") {
          this.setState({
            disabled: true,
            reason: "",
            clearText: "cleared"
          });
        }
      } else {
        if (this.state.clearText !== "") {
          this.setState({
            disabled: false,
            reason: "",
            clearText: ""
          });
        }
      }
    }
  }

  openHistory = () => {
    api.fetch(`/api/history/${this.props.cohort}/${this.props.user.id}`, "get").then(res => {
      api.fetch(`/api/cohort/${this.props.cohort}/details`, "get").then(response => {
        this.setState({
          openHistory: true,
          history: res.data.history,
          cohort: response.data.cohort[0]
        });
      });
    });
  };

  componentDidUpdate() {
    if (this.props.raise === "Waiting for help") {
      if (this.state.clearText === "") {
        this.setState({
          disabled: true,
          reason: "",
          clearText: "cleared"
        });
      }
    } else {
      if (this.props.requested) {
        if (this.state.clearText === "") {
          this.setState({
            disabled: true,
            reason: "",
            clearText: "cleared"
          });
        }
      } else {
        if (this.state.clearText !== "") {
          this.setState({
            disabled: false,
            reason: "",
            clearText: ""
          });
        }
      }
    }
  }

  handleChange = e => {
    this.setState({
      reason: e.target.value
    });
    this.props.handleChangeReasons(e);
  };

  handleCloseHistory = () => {
    this.setState({
      openHistory: false
    })
  }

  render() {
    return (
      <React.Fragment>
        <Grid item xs={12} sm={12}>
          <TextField
            value={this.state.reason}
            onChange={e => this.handleChange(e)}
            classes={{ root: "MenuItem" }}
            id="outlined-full-width"
            placeholder="Ask for help"
            fullWidth
            disabled={this.state.disabled}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <History 
          open={this.state.openHistory}
          cohort={this.state.cohort}
          handleClose={this.handleCloseHistory}
          history={this.state.history}
        />
      </React.Fragment>
    );
  }
}
