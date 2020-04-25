import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Avatar
} from "@material-ui/core";

import api from "./../../../../services/fetchApi";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AddCoMentor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: [],
      check: false
    };
  }

  handleChecked = value => {
    var temp = this.state.postData;
    if (temp.indexOf(value) !== -1) {
      temp.splice(temp.indexOf(value), 1);
    } else {
      temp.push(value);
    }
    this.setState({
      postData: [...temp]
    });
  };

  save = (postData, cohortId) => {
    const mentor_id = {
      mentor_id: postData
    };
    api.fetch(`/api/addCoMentor/${cohortId}`, "post", mentor_id).then(data => {
      this.props.mount();
    });
  };

  render() {
    const {
      open,
      close,
      mentors,
      coMentor,
      cohortDetails,
      mount,
      availableMentor
    } = this.props;
    return (
      <div>
        <ToastContainer
          enableMultiContainer
          position={toast.POSITION.TOP_RIGHT}
        />
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={close}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            style={{ color: "purple" }}
          >
            {"Choose Mentor"}
          </DialogTitle>
          <DialogContent>
            <List dense>
              {(() => {
                if (coMentor.length > 0) {
                  if (availableMentor.length > 0) {
                    return availableMentor.map(value => {
                      return (
                        <ListItem
                          key={value.id}
                          button
                          onClick={() => {
                            this.handleChecked(value.id);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={`Avatar${value.id}`}
                              src={`${value.avatar}`}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            id={value.id}
                            primary={`${value.first_name} ${value.last_name} `}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              checked={
                                this.state.postData.indexOf(value.id) !== -1
                              }
                              onClick={() => {
                                this.handleChecked(value.id);
                              }}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    });
                  } else {
                    return (
                      <ListItem>
                        <ListItemText primary={`NO MENTOR AVAILABLE`} />
                      </ListItem>
                    );
                  }
                } else {
                  if (mentors.length > 0) {
                    return mentors.map(value => {
                      return (
                        <ListItem
                          key={value.id}
                          button
                          onClick={() => {
                            this.handleChecked(value.id);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={`Avatar${value.id}`}
                              src={`${value.avatar}`}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            id={value.id}
                            primary={`${value.first_name} ${value.last_name} `}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              checked={
                                this.state.postData.indexOf(value.id) !== -1
                              }
                              onClick={() => {
                                this.handleChecked(value.id);
                              }}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    });
                  } else {
                    return (
                      <ListItem>
                        <ListItemText primary={`NO MENTOR AVAILABLE`} />
                      </ListItem>
                    );
                  }
                }
              })()}
            </List>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={close}>
              Cancel
            </Button>
            {this.state.postData.length > 0 ? (
              <Button
                color="primary"
                onClick={() => {
                  close();
                  mount();
                  let cohort_id;
                  cohortDetails.forEach(data => {
                    cohort_id = data.id;
                  });
                  this.save(this.state.postData, cohort_id);
                  setTimeout(() => {
                    toast.success("Added Co-Mentor", {
                      hideProgressBar: true,
                      draggable: false
                    });
                  }, 1);
                }}
              >
                Save
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AddCoMentor;
