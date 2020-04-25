import React, { PureComponent } from "react";

import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import MoveToQueue from "@material-ui/icons/AddToQueue";
import {
  Paper,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  InputBase,
  IconButton,
  Tooltip,
  Badge,
  List
} from "@material-ui/core";

import api from "../../services/fetchApi";

const styles = theme => ({
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
  },
  leftNav: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 1),
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)"
  },
  list: {
    maxHeight: "63px",
    // marginTop: "15px",
    "&:hover .actionShow": {
      display: "block",
      marginLeft: "-42px",
      marginTop: "13px"
    }
  },
  queueAction: {
    display: "none"
  },
  responsive: {
    "@media (max-width: 425px)": {
      padding: "3px",
      fontSize: "14px"
    }
  },
  actionIcon: {
    cursor: "pointer",
    color: "#91a1af",
    fontSize: "18px",
    "@media (max-width: 425px)": {
      fontSize: "14px"
    }
  },
  chatList: {
    maxHeight: "250px",
    minHeight: "315px",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
    overflowY: "scroll",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px"
  },
  emptyQueue: {
    marginTop: 65,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  userAvatar: {
    width: 35,
    height: 35,
    "@media (max-width: 425px)": {
      width: 29,
      height: 29
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
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "5px 20px"
  },
  multiline: {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "-10px",
    flex: "1 1 auto",
    minWidth: 0
  },
  chatName: {
    fontWeight: 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  chatDetails: {
    color: "#546e7a",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "@media (max-width: 425px)": {
      fontSize: "14px"
    }
  },
  chatAction: {
    display: "flex",
    alignItems: "flex-end",
    marginLeft: "16px",
    flexDirection: "column",
    marginBottom: 3

  },
  chatTime: {
    color: "#546e7a",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "18px",
    marginLeft: "14px",
    "@media (max-width: 425px)": {
      fontSize: "12px"
    }
  },
  ab: {
    width: "8px",
    height: "8px"
  },
  cd: {
    display: "inline-block"
  },
  online: {
    borderRadius: "50%",
    backgroundColor: "#43a047",
    marginRight: "10px"
  },
  offline: {
    borderRadius: "50%",
    backgroundColor: "#ababab",
    marginRight: "10px"
  },
  chatBadge: {
    float: "right",
    marginRight: "21px",
    // marginTop: "0px"
  }
});

class ChatList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.cohort_id,
      students: [],
      search: "",
    };
  }


  componentDidMount() {
    api.fetch(`/api/cohort/${this.state.id}/members/list`, "get").then(res => {
      this.setState({
        students: res.data.students
      });
    })
  }

  unreadChat = (studentSub) => {
    let count = 0;
    this.props.conversation.forEach(convo => {
      if (parseInt(convo.cohort_id) === parseInt(this.props.cohort_id)) {
        if (convo.chatmate_id === this.props.sub && convo.sender_id === studentSub) {
          if (convo.seen === 0) {
            count = count + 1
          }
        }
      }
    })
    return count
  }

  convoMessage = (studentSub, need) => {
    let conversation = [];
    this.props.conversation.map(convo => {
      if (parseInt(convo.cohort_id) === parseInt(this.props.cohort_id)) {
        if ((convo.sender_id === this.props.sub && convo.chatmate_id === studentSub) ||
          (convo.chatmate_id === this.props.sub && convo.sender_id === studentSub)) {
          conversation.push(convo)
        }
      }
      return conversation
    })

    if (conversation.length !== 0) {
      if (need === 'message') {
        if (conversation[conversation.length - 1].chat_type === "image") {
          return "Sent an image"
        }
        else if (conversation[conversation.length - 1].chat_type === "gif") {
          return "Sent a GIF"
        }
        else if (conversation[conversation.length - 1].chat_type === "file") {
          return "Sent a file"
        }
        else if (conversation[conversation.length - 1].chat_type === "code") {
          return "Sent a code snippet"
        }
        else {
          return conversation[conversation.length - 1].message;
        }
      } else if (need === 'time') {
        let display = conversation[conversation.length - 1].time.split(" ");
        return `${display[3]} ${display[4]}`;
      }
    } else {
      if (need === 'message') {
        return 'No conversation'
      }
    }
  }

  render() {
    const { classes } = this.props;
    const studentFilter = this.state.students.filter((data) => {
      let fname = data.first_name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      let lname = data.last_name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      if (fname) {
        return fname;
      } else {
        return lname;
      }
    }) 

    return (
      <React.Fragment>
        {/* Chat List Header*/}
        <Paper className={classes.leftNav} square={true}>
          <div className={classes.search}>
            <div className={classes.searchIcon} />
            <InputBase
              className={classes.margin}
              placeholder="Search Students"
              inputProps={{ "aria-label": "naked" }}
              fullWidth
              onChange={e => this.setState({ search: e.target.value })}
            />
            <SearchIcon style={{ color: "#8c929c" }} />
          </div>
        </Paper>
        {/* End Chat List Header*/}

        {/* Chat List Container*/}
        <Paper
          className={`${classes.chatList} ${classes.scrollBar}`}
          square={true}
        >
          <List>
          {/* Chat List */}
          {studentFilter.map(student => (
            <ListItem className={classes.list} key={student.id} onClick={() => {
              this.props.sendChatSub(student.sub);
              this.unreadChat(student.sub)
            }} button>
              <ListItemAvatar>
                <Avatar src={student.avatar} className={classes.userAvatar} />
              </ListItemAvatar>
              <div className={classes.multiline}>
                <Typography className={classes.chatName}>
                  {student.first_name + " " + student.last_name}
                </Typography>
                <Typography className={classes.chatDetails}>
                  {this.convoMessage(student.sub, 'message')}
                </Typography>
              </div>
              <div className={classes.chatAction}>
                <Typography className={classes.chatTime}>
                  {" "}
                  {this.convoMessage(student.sub, 'time')}{" "}
                </Typography>
                <Typography className={classes.chatBadge}>
                  <Badge
                    color="secondary"
                    badgeContent={this.unreadChat(student.sub)}
                    invisible={this.unreadChat(student.sub) === 0 ? true : false}
                  ></Badge>
                </Typography>
              </div>
              <div className={`${classes.queueAction} actionShow`}>
                <Tooltip title={this.props.members.filter(
                          requested =>
                            requested.sub === student.sub &&
                            parseInt(this.props.cohort_id) ===
                            parseInt(requested.cohort_id)
                        ).length !== 0
                          ? "Already on Queue"
                          : "Move To Queue"} placement="top">
                  <div>
                    <IconButton
                      disabled={
                        this.props.members.filter(
                          requested =>
                            requested.sub === student.sub &&
                            parseInt(this.props.cohort_id) ===
                            parseInt(requested.cohort_id)
                        ).length !== 0
                          ? true
                          : false
                      }
                      className={classes.responsive}
                      onClick={(e) => {
                        this.props.moveToQueue(student.sub)
                        e.stopPropagation()
                      }}
                    >
                      <MoveToQueue className={classes.actionIcon} />
                    </IconButton>
                  </div>
                </Tooltip>
              </div>
            </ListItem>
          ))}
          {/* End Chat List */}
          </List>
          {/* End No Message Display */}
        </Paper>
        {/* End Chat List Container*/}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ChatList);
