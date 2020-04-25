import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { toast } from "react-toastify";

import api from "../../../services/fetchApi";

export default class SignInKey extends Component {
  constructor() {
    super();

    this.state = {
      key: ""
    };
  }

  handleKey = e => this.setState({ key: e.target.value });

  validateKey = () => {
    this.props.getValidatedKeyFn(this.state.key);
    api.fetch("/validate", "post", this.state).then(res => {
      if (res.data.key === null) {
        toast.error("Sorry, wrong key", {
          hideProgressBar: true,
          draggable: false
        });
        this.setState({ key: "" });
      } else {
        this.props.handleCancel();
        this.props.openSignInGoogleFn();
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.content}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="key"
            label={this.props.label}
            type="key"
            fullWidth
            value={this.state.key}
            onChange={e => this.handleKey(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={this.validateKey}
            disabled={this.state.key === "" ? true : false}
          >
            Ok
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
