import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import {
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  InputBase,
  Badge
} from "@material-ui/core";


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
    maxHeight: "60px"
  },
  chatList: {
    maxHeight: "248px",
    minHeight: 248,
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
    marginBottom: "10px"
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

  chatBadge: {
    float: "right",
    marginRight: "12px",
    marginTop: "0px"
  }
});

class ChatList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
  }

  unreadChat = studentSub => {
    let count = 0;
    this.props.conversation.forEach(convo => {
      if (parseInt(convo.cohort_id) === parseInt(this.props.cohort_id)) {
        if (
          convo.chatmate_id === this.props.sub &&
          convo.sender_id === studentSub
        ) {
          if (convo.seen === 0) {
            count = count + 1;
          }
        }
      }
    });
    return count;
  };

  convoMessage = (mentorSub, need) => {
    let conversation = [];
    this.props.conversation.map(convo => {
      if (parseInt(convo.cohort_id) === parseInt(this.props.cohort_id)) {
        if (
          (convo.sender_id === this.props.sub &&
            convo.chatmate_id === mentorSub) ||
          (convo.chatmate_id === this.props.sub &&
            convo.sender_id === mentorSub)
        ) {
          conversation.push(convo);
        }
      }
      return conversation;
    });
    if (conversation.length !== 0) {
      if (need === "message") {
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
      } else if (need === "time") {
        let display = conversation[conversation.length - 1].time.split(" ");
        return `${display[3]} ${display[4]}`;
      }
    } else {
      if (need === "message") {
        return "No conversation";
      }
    }
  };

  render() {
    const { classes } = this.props;

    const mentorFilter = this.props.mentor.filter(data => {
      let fname =
        data.first_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1;
      let lname =
        data.last_name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1;
      if (fname) {
        return fname;
      } else {
        return lname;
      }
    });
    return (
      <React.Fragment>
        {/* Chat List Header*/}
        <Paper className={classes.leftNav} square={true}>
          <div className={classes.search}>
            <div className={classes.searchIcon} />
            <InputBase
              className={classes.margin}
              placeholder="Search Mentor"
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
          {/* Chat List */}
          <List>
            {mentorFilter.map(mentor => (
              <ListItem
                className={classes.list}
                key={mentor.id}
                onClick={() => {
                  this.props.sendChatSub(mentor.sub);
                  this.unreadChat(mentor.sub);
                }}
                button
              >
                <ListItemAvatar>
                  <Avatar src={mentor.avatar} className={classes.userAvatar} />
                </ListItemAvatar>
                <div className={classes.multiline}>
                  <Typography className={classes.chatName}>
                    {mentor.first_name + " " + mentor.last_name}
                  </Typography>
                  <Typography className={classes.chatDetails}>
                    {this.convoMessage(mentor.sub, "message")}
                  </Typography>
                </div>
                <div className={classes.chatAction}>
                  <Typography className={classes.chatTime}>
                    {" "}
                    {this.convoMessage(mentor.sub, "time")}{" "}
                  </Typography>
                  <Typography className={classes.chatBadge}>
                    <Badge
                      color="secondary"
                      badgeContent={this.unreadChat(mentor.sub)}
                      invisible={
                        this.unreadChat(mentor.sub) === 0 ? true : false
                      }
                      className={classes.margin}
                    ></Badge>
                  </Typography>
                </div>
              </ListItem>
            ))}
          </List>
          {/* End Chat List */}

          {/* End No Message Display */}
        </Paper>
        {/* End Chat List Container*/}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ChatList);

// import React, { PureComponent } from "react";
// import { withStyles } from "@material-ui/core/styles";
// import SearchIcon from "@material-ui/icons/Search";
// import EmptyQueue from "../../images/empty.svg";
// import {
//   Paper,
//   Grid,
//   Typography,
//   Avatar,
//   ListItem,
//   ListItemAvatar,
//   InputBase,
//   Badge
// } from "@material-ui/core";

// const styles = theme => ({
//   scrollBar: {
//     "&::-webkit-scrollbar": {
//       width: "0.3em"
//     },
//     "&::-webkit-scrollbar-track": {
//       "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: "rgba(0,0,0,.1)",
//       borderRadius: "10px",
//       outline: "1px solid slategrey"Queue Students
//     }Queue Students
//   },Queue Students
//   leftNav: {
//     marginTop: theme.spacing(2),
//     padding: theme.spacing(1, 1),
//     borderTopRightRadius: "5px",
//     borderTopLeftRadius: "5px",
//     boxShadow:
//       "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)"
//   },
//   list: {
//     maxHeight: "52px",
//     marginTop: "15px",
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: "#f1f1f1",
//       minHeight: 51
//     }
//   },
//   chatList: {
//     maxHeight: "380px",
//     minHeight: "380px",
//     boxShadow:
//       "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
//     overflowY: "scroll",
//     borderBottomRightRadius: "5px",
//     borderBottomLeftRadius: "5px"
//   },
//   emptyQueue: {
//     marginTop: 65,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column"
//   },
//   userAvatar: {
//     width: 35,
//     height: 35,Queue Students
//     "@media (max-width: 425px)": {
//       width: 29,
//       height: 29
//     }
//   },
//   queueName: {
//     fontSize: "17px",
//     "@media (max-width: 425px)": {
//       fontSize: "14px",
//       marginLeft: -24
//     }
//   },
//   responsiveHeader: {
//     "@media (max-width: 425px)": {
//       fontSize: "17px"
//     }
//   },
//   search: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "5px 20px"
//   },
//   multiline: {
//     marginTop: "10px",
//     marginBottom: "10px",
//     marginLeft: "-10px",
//     flex: "1 1 auto",
//     minWidth: 0
//   },
//   chatName: {
//     fontWeight: 500,
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//     "@media (max-width: 425px)": {
//       fontSize: "15px"
//     }
//   },
//   chatDetails: {
//     color: "#546e7a",
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//     "@media (max-width: 425px)": {
//       fontSize: "14px"
//     }
//   },
//   chatAction: {
//     display: "flex",
//     alignItems: "flex-end",
//     marginLeft: "16px",
//     flexDirection: "column",
//     marginBottom: "10px"
//   },
//   chatTime: {
//     color: "#546e7a",
//     fontSize: "12px",
//     fontWeight: 400,
//     lineHeight: "18px",
//     marginLeft: "14px",
//     "@media (max-width: 425px)": {
//       fontSize: "12px"
//     }
//   },

//   chatBadge: {
//     float: "right",
//     marginRight: "12px",
//     marginTop: "0px"
//   }
// });

// class ChatList extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0,
//       search: "",
//       conversation: [],
//     };
//   }

//   timeDisplay = time => {
//     let display = time.split(" ");
//     return `${display[3]} ${display[4]}`;
//   };

//   componentDidUpdate() {
//     let count = 0;
//     this.props.mentor.map(mentor =>
//       this.props.conversation.map(convo => {
//         if (
//           this.props.sub === convo.chatmate_id &&
//           mentor.sub === convo.sender_id
//         ) {
//           if (
//             convo.seen === 0 &&
//             convo.cohort_id === parseInt(this.props.cohort_id)
//           ) {
//             count = count + 1;
//           }
//         }
//         return null;
//       })
//     );
//     return this.setState({ count: count });
//   }

//   componentDidMount() {
//     this.componentDidUpdate();

//     this.props.conversation.map(convo => {
//       if (convo.cohort_id === parseInt(this.props.cohort_id)) {
//         if ((convo.sender_id === this.props.sub && convo.chatmate_id === this.props.mentor[0].sub) ||
//           (convo.chatmate_id === this.props.sub && convo.sender_id === this.props.mentor[0].sub)) {
//           this.setState(prevState => ({
//             conversation: [...prevState.conversation, convo]
//           }))
//         }
//       }
//     })
//   }

//   render() {
//     const { classes } = this.props;
//     return (
//       <React.Fragment>
//         {/* Chat List Header*/}
//         <Paper className={classes.leftNav} square={true}>
//           <div className={classes.search}>
//             <div className={classes.searchIcon} />
//             <InputBase
//               className={classes.margin}
//               placeholder="Search Conversation"
//               inputProps={{ "aria-label": "naked" }}
//               fullWidth
//               onChange={e => this.setState({ search: e.target.value })}
//             />
//             <SearchIcon style={{ color: "#8c929c" }} />
//           </div>
//         </Paper>
//         {/* End Chat List Header*/}

//         {/* Chat List Container*/}
//         <Paper
//           className={`${classes.chatList} ${classes.scrollBar}`}
//           square={true}
//         >
//           {/* Chat List */}

//           {this.props.mentor.map((mentor, i) => {
//             if (this.state.search) {
//               return (
//                 <React.Fragment key={i}>
//                   {this.props.conversation.length !== 0 ? (
//                     this.state.conversation.map((convo, i) => {
//                       if (convo.message.toLowerCase().includes(this.state.search.toLowerCase())) {
//                         return (
//                           <React.Fragment key={i}>
//                             <ListItem
//                               className={classes.list}
//                               onClick={() => {
//                                 this.props.sendChatSub(mentor.sub);
//                                 this.props.chatmateSub(mentor.sub)
//                               }}
//                             >
//                               <ListItemAvatar>
//                                 <Avatar
//                                   src={mentor.avatar}
//                                   className={classes.userAvatar}
//                                 />
//                               </ListItemAvatar>
//                               <div className={classes.multiline}>
//                                 <Typography className={classes.chatName}>
//                                   {mentor.first_name} {mentor.last_name}
//                                 </Typography>
//                                 <Typography className={classes.chatDetails}>
//                                   {convo.message}
//                                 </Typography>
//                               </div>
//                               <div className={classes.chatAction}>
//                                 <Typography className={classes.chatTime}>
//                                   {" "}
//                                   {this.timeDisplay(convo.time)}{" "}
//                                 </Typography>
//                                 <Typography className={classes.chatBadge}>
//                                   <Badge
//                                     color="secondary"
//                                     badgeContent={this.state.count}
//                                     invisible={
//                                       this.props.priv === "student" &&
//                                         this.state.count !== 0
//                                         ? this.props.badge
//                                         : true
//                                     }
//                                     className={classes.margin}
//                                   ></Badge>
//                                 </Typography>
//                               </div>
//                             </ListItem>
//                           </React.Fragment>
//                         )
//                       }
//                       return null;
//                     })
//                   ) : (
//                       <Grid container className={classes.emptyQueue}>
//                         <img
//                           alt={"empty queue"}
//                           src={EmptyQueue}
//                           width="200"
//                           height="180"
//                         />
//                         <Typography variant="overline" display="block">
//                           No message available...
//                         </Typography>
//                       </Grid>
//                     )}
//                 </React.Fragment>
//               );
//             } else {
//               return (
//                 <React.Fragment key={i}>
//                 {this.state.conversation.map(convo => (
//                   this.state.conversation[this.state.conversation.length-1] === convo?

//                     <ListItem
//                       className={classes.list}
//                       onClick={() => {
//                         this.props.sendChatSub(mentor.sub);
//                       }}
//                     >
//                       <ListItemAvatar>
//                         <Avatar
//                           src={mentor.avatar}
//                           className={classes.userAvatar}
//                         />
//                       </ListItemAvatar>
//                       <div className={classes.multiline}>
//                         <Typography className={classes.chatName}>
//                           {mentor.first_name} {mentor.last_name}
//                         </Typography>
//                         <Typography className={classes.chatDetails}>
//                           {convo.message}
//                       </Typography>
//                       </div>
//                       <div className={classes.chatAction}>
//                         <Typography className={classes.chatTime}>
//                           {" "}
//                           {this.timeDisplay(convo.time)}{" "}
//                         </Typography>
//                         <Typography className={classes.chatBadge}>
//                           <Badge
//                             color="secondary"
//                             badgeContent={this.state.count}
//                             invisible={
//                               this.props.priv === "student" &&
//                                 this.state.count !== 0
//                                 ? this.props.badge
//                                 : true
//                             }
//                             className={classes.margin}
//                           ></Badge>
//                         </Typography>
//                       </div>
//                     </ListItem>
//                   :null
//                   ))}
//                   </React.Fragment>
//                 )
//             }
//           })}
//         </Paper>
//       </React.Fragment>
//     );
//   }
// }

// export default withStyles(styles)(ChatList);
