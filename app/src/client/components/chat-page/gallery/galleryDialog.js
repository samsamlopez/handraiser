import React from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Transition from "./transition";
import Carousel from "./carousel";

export default class Gallery extends React.Component {
  render() {
    const { open, handleClose, conversation, selected } = this.props;
    return (
      <Dialog
        fullWidth
        fullScreen
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogContent
          style={{
            background: "black",
            padding: "41px 24px 0px 24px"
          }}
        >
          <Carousel images={conversation} selected={selected} />
        </DialogContent>
        <DialogActions style={{ background: "black" }}>
          <IconButton
            onClick={handleClose}
            style={{
              color: "#b3aeaa",
              position: "absolute",
              right: 19,
              top: 13
            }}
          >
            <Close fontSize="large" />
          </IconButton>
        </DialogActions>
      </Dialog>
    );
  }
}
