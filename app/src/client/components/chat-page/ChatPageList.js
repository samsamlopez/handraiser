import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./ChatPageStyle";
import Paper from "@material-ui/core/Paper";

//CHATLIST
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import MessageIcon from "@material-ui/icons/Message";
import GroupIcon from "@material-ui/icons/Group";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Online from "../../images/active.png";

//DIALOGS
import Compose from "./dialogs/Compose";
import CreateGroup from "./dialogs/CreateGroup";
import { Tooltip } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
class ChatPageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchChatName: "",
      searchGroupName: "",
      value: 0,
      openDialog: false,
      openDialogGroup: false
    };
  }

  convoMessage = (chatListSub, need) => {
    let conversation = [];
    this.props.conversation.map(convo => {
      if (convo.cohort_id === "all") {
        if (
          (convo.sender_id === this.props.sub &&
            convo.chatmate_id === chatListSub) ||
          (convo.chatmate_id === this.props.sub &&
            convo.sender_id === chatListSub)
        ) {
          conversation.push(convo);
        }
      }
      // return conversation
      return null;
    });
    if (conversation.length !== 0) {
      if (need === "message") {
        if (conversation[conversation.length - 1].chat_type === "image") {
          return "Sent an image";
        } else if (conversation[conversation.length - 1].chat_type === "gif") {
          return "Sent a GIF";
        } else if (conversation[conversation.length - 1].chat_type === "file") {
          return "Sent a file";
        } else if (conversation[conversation.length - 1].chat_type === "code") {
          return "Sent a code snippet";
        } else {
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

  //added group chat
  groupConvoMessage = (gc_id, need) => {
    let conversation = [];
    this.props.groupConversation.map(gcConvo => {
      if (gcConvo.groupchat_id === parseInt(gc_id)) {
        conversation.push(gcConvo);
      }
      return null;
    });
    if (conversation.length !== 0) {
      if (need === "message") {
        if (conversation[conversation.length - 1].chat_type === "image") {
          return "Sent an image";
        } else if (conversation[conversation.length - 1].chat_type === "gif") {
          return "Sent a GIF";
        } else if (conversation[conversation.length - 1].chat_type === "file") {
          return "Sent a file";
        } else if (conversation[conversation.length - 1].chat_type === "code") {
          return "Sent a code snippet";
        } else {
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

  unreadGroupChat = gc_id => {
    let count = 0;

    this.props.groupConversation.map(gcConvo => {
      let x = 0;
      if (gcConvo.groupchat_id === parseInt(gc_id)) {
        gcConvo.seen.split(",").map(seen => {
          if (parseInt(seen) === parseInt(this.props.sub)) {
            x++;
          }
          return null;
        });
      }
      if (x === 0 && gcConvo.groupchat_id === parseInt(gc_id)) {
        count++;
      }
      return null;
    });
    return count;
  };
  //end of added group chat

  unreadChat = studentSub => {
    let count = 0;
    this.props.conversation.map(convo => {
      if (convo.cohort_id === "all") {
        if (
          convo.chatmate_id === this.props.sub &&
          convo.sender_id === studentSub
        ) {
          if (convo.seen === 0) {
            count = count + 1;
          }
        }
      }
      return null;
    });
    return count;
  };

  searchChatName = searchChatName => {
    this.setState({ searchChatName });
  };
  searchGroupName = searchGroupName => {
    this.setState({ searchGroupName });
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleClickOpen = () => this.setState({ openDialog: true });
  handleClickOpenGroup = () => this.setState({ openDialogGroup: true });

  handleClose = () => this.setState({ openDialog: false });

  handleClickOpenGroup = () => this.setState({ openDialogGroup: true });
  handleCloseGroup = () => this.setState({ openDialogGroup: false });

  render() {
    const { classes } = this.props;
    return (
      <Grid item md={3} xs={4}>
        <Paper>
          <div style={{ padding: 13 }}>
            <div className={classes.chatListHeader}>
              <span className={classes.avatarWrapper}>
                <Avatar
                  style={{ marginRight: "10px" }}
                  src={this.props.userInfo.avatar}
                >
                  ME
                </Avatar>
                <Typography variant="h5">Messages</Typography>
              </span>
              <Hidden xsDown>
                {this.state.value === 0 ? (
                  <Tooltip title="Create Message" placement="left">
                    <IconButton onClick={this.handleClickOpen}>
                      <CreateIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  this.props.userInfo.privilege === 'mentor' ?
                  <Tooltip title="Create Group" placement="left">
                    <IconButton onClick={this.handleClickOpenGroup}>
                      <GroupAddIcon />
                    </IconButton>
                  </Tooltip>
                  :
                  null
                )}
              </Hidden>

              {/* COMPOSE DIALOG */}
              <Compose
                openDialog={this.state.openDialog}
                handleClose={this.handleClose}
                avatarSample={this.props.userInfo.avatar}
                sendChat={this.props.sendChat}
                chatListInfo={this.props.chatListInfo}
                sub={this.props.sub}
                userInfo={this.props.userInfo}
              />

              <CreateGroup
                openDialog={this.state.openDialogGroup}
                handleClose={this.handleCloseGroup}
                avatarSample={this.props.userInfo.avatar}
                sub={this.props.sub}
                userInfo={this.props.userInfo}
              />
            </div>
            <div>
              <TextField
                onChange={e =>
                  this.state.value === 0
                    ? this.searchChatName(e.target.value)
                    : this.searchGroupName(e.target.value)
                }
                id="outlined-search"
                label={this.state.value === 0 ? "Search Name" : "Search Group"}
                inputProps={{
                  style: {
                    height: "4px"
                  }
                }}
                InputLabelProps={{
                  style: {
                    height: "3px",
                    marginTop: -6
                  }
                }}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </div>
          </div>
          <Divider />

          <Tabs
            value={this.state.value}
            variant="fullWidth"
            onChange={this.handleChange}
            aria-label="simple tabs example"
          >
            <Tab icon={<MessageIcon />} {...a11yProps(0)} />
            <Tab icon={<GroupIcon />} {...a11yProps(1)} />
          </Tabs>
          <div className={`${classes.scrollBar} ${classes.chatListWrapper}`}>
            <TabPanel value={this.state.value} index={0}>
              <List>
                {this.props.chatListInfo.length !== 0
                  ? this.props.chatListInfo.map((chatmate, i) => {
                      if (
                        chatmate.first_name
                          .toLowerCase()
                          .includes(this.state.searchChatName.toLowerCase()) ||
                        chatmate.last_name
                          .toLowerCase()
                          .includes(this.state.searchChatName.toLowerCase())
                      ) {
                        return (
                          <React.Fragment key={i}>
                            <ListItem
                              alignItems="flex-start"
                              button
                              onClick={() => {
                                this.props.changeChatmate(chatmate.sub);
                                this.props.selectChatmate(chatmate.sub);


                                if(this.unreadChat(chatmate.sub) !== 0){
                                  this.props.displayBadge(chatmate.sub, "pm")
                                }


                              }}
                              style={
                                this.props.chatmateInfo.sub === chatmate.sub
                                  ? { backgroundColor: "#cfd8f987" }
                                  : null
                              }
                            >
                              <Hidden only="xs">
                                <ListItemAvatar style={{ marginTop: "-0.2px" }}>
                                  <div>
                                    <Avatar src={chatmate.avatar} />
                                    {chatmate.status === 'active' ?
                                    <img
                                    style={{
                                      width: 35,
                                      height: 35,
                                      margin: 0,
                                      position: "absolute",
                                      top: 24,
                                      left: 32, 
                                    }}
                                    src={Online}
                                    alt=""
                                  />
                                  :
                                  null
                                    }
                                    
                                  </div>
                                </ListItemAvatar>
                                <div className={classes.chatDetails}>
                                  <div style={{ width: "80%" }}>
                                    <Typography variant="body1">
                                      {`${chatmate.first_name} ${chatmate.last_name}`}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      className={classes.chatPrev}
                                    >
                                      {this.convoMessage(
                                        chatmate.sub,
                                        "message"
                                      )}
                                    </Typography>
                                  </div>

                                  <div className={classes.timeBadgeWrap}>
                                    <Typography variant="caption">
                                      {this.convoMessage(chatmate.sub, "time")}
                                    </Typography>
                                    <div style={{ marginTop: 3 }}>
                                      <Badge
                                        color="secondary"
                                        badgeContent={this.unreadChat(
                                          chatmate.sub
                                        )}
                                        invisible={
                                          this.unreadChat(chatmate.sub) === 0
                                            ? true
                                            : false
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Hidden>
                              <Hidden smUp>
                                <div className={classes.smBP}>
                                  <Avatar src={chatmate.avatar} />
                                  <Badge
                                    color="secondary"
                                    badgeContent={this.unreadChat(chatmate.sub)}
                                    invisible={
                                      this.unreadChat(chatmate.sub) === 0
                                        ? true
                                        : false
                                    }
                                  />
                                </div>
                              </Hidden>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        );
                      }
                      return null;
                    })
                  : null}
              </List>
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              <List>
                {this.props.groupListInfo.map((gc, i) => {
                  if (
                    gc.name
                      .toLowerCase()
                      .includes(this.state.searchGroupName.toLowerCase())
                  ) {
                    return (
                      <React.Fragment key={i}>
                        <ListItem
                          alignItems="flex-start"
                          button
                          onClick={() => {
                            this.props.changeChatmate(gc.id);
                            this.props.selectChatmate(gc.id);

                            if(this.unreadGroupChat(gc.id) !== 0){
                              this.props.displayBadge(gc.id, "gc");
                            }
                            
                          }}
                          style={
                            this.props.chatmateInfo.id === gc.id
                              ? { backgroundColor: "#cfd8f987" }
                              : null
                          }
                        >
                          <Hidden only="xs">
                            <ListItemAvatar style={{ marginTop: "-0.2px" }}>
                              <Avatar>
                                {" "}
                                <GroupIcon />{" "}
                              </Avatar>
                            </ListItemAvatar>
                            <div className={classes.chatDetails}>
                              <div style={{ width: "80%" }}>
                                <Typography
                                  variant="body1"
                                  className={classes.chatPrev}
                                >
                                  {gc.name}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  className={classes.chatPrev}
                                >
                                  {this.groupConvoMessage(gc.id, "message")}
                                </Typography>
                              </div>

                              <div className={classes.timeBadgeWrap}>
                                <Typography variant="caption">
                                  {this.groupConvoMessage(gc.id, "time")}
                                </Typography>
                                <div style={{ marginTop: 3 }}>
                                  <Badge
                                    color="secondary"
                                    badgeContent={this.unreadGroupChat(gc.id)}
                                    invisible={
                                      this.unreadGroupChat(gc.id) === 0
                                        ? true
                                        : false
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </Hidden>
                          <Hidden smUp>
                            <div className={classes.smBP}>
                              <Avatar>
                                {" "}
                                <GroupIcon />{" "}
                              </Avatar>
                              <Badge
                                color="secondary"
                                badgeContent={this.unreadGroupChat(gc.id)}
                                invisible={
                                  this.unreadGroupChat(gc.id) === 0
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </Hidden>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </List>
            </TabPanel>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChatPageList);


// import React, { PureComponent } from "react";
// import { withStyles } from "@material-ui/core/styles";
// import styles from "./ChatPageStyle";
// import Paper from "@material-ui/core/Paper";

// //CHATLIST
// import Divider from "@material-ui/core/Divider";
// import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
// import TextField from "@material-ui/core/TextField";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import CreateIcon from "@material-ui/icons/Create";
// import IconButton from "@material-ui/core/IconButton";
// import Hidden from "@material-ui/core/Hidden";
// import Grid from "@material-ui/core/Grid";
// import Badge from "@material-ui/core/Badge";
// import MessageIcon from "@material-ui/icons/Message";
// import GroupIcon from "@material-ui/icons/Group";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
// import Box from "@material-ui/core/Box";
// import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import Online from "../../images/active.png";

// //DIALOGS
// import Compose from "./dialogs/Compose";
// import CreateGroup from "./dialogs/CreateGroup";
// import { Tooltip } from "@material-ui/core";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <Typography
//       component="div"
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       <Box>{children}</Box>
//     </Typography>
//   );
// }

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`
//   };
// }
// class ChatPageList extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       searchChatName: "",
//       searchGroupName: "",
//       value: 0,
//       openDialog: false,
//       openDialogGroup: false
//     };
//   }

//   convoMessage = (chatListSub, need) => {
//     let conversation = [];
//     this.props.conversation.map(convo => {
//       if (convo.cohort_id === "all") {
//         if (
//           (convo.sender_id === this.props.sub &&
//             convo.chatmate_id === chatListSub) ||
//           (convo.chatmate_id === this.props.sub &&
//             convo.sender_id === chatListSub)
//         ) {
//           conversation.push(convo);
//         }
//       }
//       // return conversation
//       return null;
//     });
//     if (conversation.length !== 0) {
//       if (need === "message") {
//         if (conversation[conversation.length - 1].chat_type === "image") {
//           return "Sent an image";
//         } else if (conversation[conversation.length - 1].chat_type === "gif") {
//           return "Sent a GIF";
//         } else if (conversation[conversation.length - 1].chat_type === "file") {
//           return "Sent a file";
//         } else if (conversation[conversation.length - 1].chat_type === "code") {
//           return "Sent a code snippet";
//         } else {
//           return conversation[conversation.length - 1].message;
//         }
//       } else if (need === "time") {
//         let display = conversation[conversation.length - 1].time.split(" ");
//         return `${display[3]} ${display[4]}`;
//       }
//     } else {
//       if (need === "message") {
//         return "No conversation";
//       }
//     }
//   };

//   //added group chat
//   groupConvoMessage = (gc_id, need) => {
//     let conversation = [];
//     this.props.groupConversation.map(gcConvo => {
//       if (gcConvo.groupchat_id === parseInt(gc_id)) {
//         conversation.push(gcConvo);
//       }
//       return null;
//     });
//     if (conversation.length !== 0) {
//       if (need === "message") {
//         if (conversation[conversation.length - 1].chat_type === "image") {
//           return "Sent an image"
//         }
//         else if (conversation[conversation.length - 1].chat_type === "gif") {
//           return "Sent a GIF"
//         }
//         else if (conversation[conversation.length - 1].chat_type === "file") {
//           return "Sent a file"
//         }
//         else if (conversation[conversation.length - 1].chat_type === "code") {
//           return "Sent a code snippet"
//         }
//         else {
//           return conversation[conversation.length - 1].message;
//         }
//       } else if (need === "time") {
//         let display = conversation[conversation.length - 1].time.split(" ");
//         return `${display[3]} ${display[4]}`;
//       }
//     } else {
//       if (need === "message") {
//         return "No conversation";
//       }
//     }
//   };

//   unreadGroupChat = gc_id => {
//     let count = 0;

//     this.props.groupConversation.map(gcConvo => {
//       let x = 0;
//       if (gcConvo.groupchat_id === parseInt(gc_id)) {
//         gcConvo.seen.split(",").map(seen => {
//           if (parseInt(seen) === parseInt(this.props.sub)) {
//             x++;
//           }
//           return null;
//         });
//       }
//       if (x === 0 && gcConvo.groupchat_id === parseInt(gc_id)) {
//         count++;
//       }
//       return null;
//     });
//     return count;
//   };
//   //end of added group chat

//   unreadChat = studentSub => {
//     let count = 0;
//     this.props.conversation.map(convo => {
//       if (convo.cohort_id === "all") {
//         if (
//           convo.chatmate_id === this.props.sub &&
//           convo.sender_id === studentSub
//         ) {
//           if (convo.seen === 0) {
//             count = count + 1;
//           }
//         }
//       }
//       return null;
//     });
//     return count;
//   };

//   searchChatName = searchChatName => {
//     this.setState({ searchChatName });
//   };
//   searchGroupName = searchGroupName => {
//     this.setState({ searchGroupName });
//   };

//   handleChange = (event, newValue) => {
//     this.setState({ value: newValue });
//   };

//   handleClickOpen = () => this.setState({ openDialog: true });
//   handleClickOpenGroup = () => this.setState({ openDialogGroup: true });

//   handleClose = () => this.setState({ openDialog: false });

//   handleClickOpenGroup = () => this.setState({ openDialogGroup: true });
//   handleCloseGroup = () => this.setState({ openDialogGroup: false });

//   render() {
//     const { classes } = this.props;
//     return (
//       <Grid item md={3} xs={4}>
//         <Paper>
//           <div style={{ padding: 13 }}>
//             <div className={classes.chatListHeader}>
//               <span className={classes.avatarWrapper}>
//                 <Avatar
//                   style={{ marginRight: "10px" }}
//                   src={this.props.userInfo.avatar}
//                 >
//                   ME
//                 </Avatar>
//                 <Typography variant="h5">Messages</Typography>
//               </span>
//               <Hidden xsDown>
//                 {this.state.value === 0 ? (
//                   <Tooltip title="Create Message" placement="left">
//                     <IconButton onClick={this.handleClickOpen}>
//                       <CreateIcon />
//                     </IconButton>
//                   </Tooltip>
//                 ) : (
//                   <Tooltip title="Create Group" placement="left">
//                     <IconButton onClick={this.handleClickOpenGroup}>
//                       <GroupAddIcon />
//                     </IconButton>
//                   </Tooltip>
//                 )}
//               </Hidden>

//               {/* COMPOSE DIALOG */}
//               <Compose
//                 openDialog={this.state.openDialog}
//                 handleClose={this.handleClose}
//                 avatarSample={this.props.userInfo.avatar}
//                 sendChat={this.props.sendChat}
//                 chatListInfo={this.props.chatListInfo}
//                 sub={this.props.sub}
//                 userInfo={this.props.userInfo}
//               />

//               <CreateGroup
//                 openDialog={this.state.openDialogGroup}
//                 handleClose={this.handleCloseGroup}
//                 avatarSample={this.props.userInfo.avatar}
//                 sub={this.props.sub}
//                 userInfo={this.props.userInfo}
//               />
//             </div>
//             <div>
//               <TextField
//                 onChange={e =>
//                   this.state.value === 0
//                     ? this.searchChatName(e.target.value)
//                     : this.searchGroupName(e.target.value)
//                 }
//                 id="outlined-search"
//                 label={this.state.value === 0 ? "Search Name" : "Search Group"}
//                 inputProps={{
//                   style: {
//                     height: "4px"
//                   }
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     height: "3px",
//                     marginTop: -6
//                   }
//                 }}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//               />
//             </div>
//           </div>
//           <Divider />

//           <Tabs
//             value={this.state.value}
//             variant="fullWidth"
//             onChange={this.handleChange}
//             aria-label="simple tabs example"
//           >
//             <Tab icon={<MessageIcon />} {...a11yProps(0)} />
//             <Tab icon={<GroupIcon />} {...a11yProps(1)} />
//           </Tabs>
//           <div className={`${classes.scrollBar} ${classes.chatListWrapper}`}>
//             <TabPanel value={this.state.value} index={0}>
//               <List>
//                 {this.props.chatListInfo.length !== 0
//                   ? this.props.chatListInfo.map((chatmate, i) => {
//                       if (
//                         chatmate.first_name
//                           .toLowerCase()
//                           .includes(this.state.searchChatName.toLowerCase()) ||
//                         chatmate.last_name
//                           .toLowerCase()
//                           .includes(this.state.searchChatName.toLowerCase())
//                       ) {
//                         return (
//                           <React.Fragment key={i}>
//                             <ListItem
//                               alignItems="flex-start"
//                               button
//                               onClick={() => {
//                                 this.props.changeChatmate(chatmate.sub);
//                                 this.props.displayBadge(chatmate.sub, "pm");
//                                 this.props.selectChatmate(chatmate.sub);
//                               }}
//                               style={
//                                 this.props.chatmateInfo.sub === chatmate.sub
//                                   ? { backgroundColor: "#cfd8f987" }
//                                   : null
//                               }
//                             >
//                               <Hidden only="xs">
//                                 <ListItemAvatar style={{ marginTop: "-0.2px" }}>
//                                   <div>
//                                     <Avatar src={chatmate.avatar} />
//                                     {chatmate.status === 'active' ?
//                                     <img
//                                     style={{
//                                       width: 35,
//                                       height: 35,
//                                       margin: 0,
//                                       position: "absolute",
//                                       top: 24,
//                                       left: 32, 
//                                     }}
//                                     src={Online}
//                                     alt=""
//                                   />
//                                   :
//                                   null
//                                     }
                                    
//                                   </div>
//                                 </ListItemAvatar>
//                                 <div className={classes.chatDetails}>
//                                   <div style={{ width: "80%" }}>
//                                     <Typography variant="body1">
//                                       {`${chatmate.first_name} ${chatmate.last_name}`}
//                                     </Typography>
//                                     <Typography
//                                       variant="subtitle2"
//                                       className={classes.chatPrev}
//                                     >
//                                       {this.convoMessage(
//                                         chatmate.sub,
//                                         "message"
//                                       )}
//                                     </Typography>
//                                   </div>

//                                   <div className={classes.timeBadgeWrap}>
//                                     <Typography variant="caption">
//                                       {this.convoMessage(chatmate.sub, "time")}
//                                     </Typography>
//                                     <div style={{ marginTop: 3 }}>
//                                       <Badge
//                                         color="secondary"
//                                         badgeContent={this.unreadChat(
//                                           chatmate.sub
//                                         )}
//                                         invisible={
//                                           this.unreadChat(chatmate.sub) === 0
//                                             ? true
//                                             : false
//                                         }
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Hidden>
//                               <Hidden smUp>
//                                 <div className={classes.smBP}>
//                                   <Avatar src={chatmate.avatar} />
//                                   <Badge
//                                     color="secondary"
//                                     badgeContent={this.unreadChat(chatmate.sub)}
//                                     invisible={
//                                       this.unreadChat(chatmate.sub) === 0
//                                         ? true
//                                         : false
//                                     }
//                                   />
//                                 </div>
//                               </Hidden>
//                             </ListItem>
//                             <Divider />
//                           </React.Fragment>
//                         );
//                       }
//                       return null;
//                     })
//                   : null}
//               </List>
//             </TabPanel>
//             <TabPanel value={this.state.value} index={1}>
//               <List>
//                 {this.props.groupListInfo.map((gc, i) => {
//                   if (
//                     gc.name
//                       .toLowerCase()
//                       .includes(this.state.searchGroupName.toLowerCase())
//                   ) {
//                     return (
//                       <React.Fragment key={i}>
//                         <ListItem
//                           alignItems="flex-start"
//                           button
//                           onClick={() => {
//                             this.props.changeChatmate(gc.id);
//                             this.props.selectChatmate(gc.id);
//                             this.props.displayBadge(gc.id, "gc");
//                           }}
//                           style={
//                             this.props.chatmateInfo.id === gc.id
//                               ? { backgroundColor: "#cfd8f987" }
//                               : null
//                           }
//                         >
//                           <Hidden only="xs">
//                             <ListItemAvatar style={{ marginTop: "-0.2px" }}>
//                               <Avatar>
//                                 {" "}
//                                 <GroupIcon />{" "}
//                               </Avatar>
//                             </ListItemAvatar>
//                             <div className={classes.chatDetails}>
//                               <div style={{ width: "80%" }}>
//                                 <Typography
//                                   variant="body1"
//                                   className={classes.chatPrev}
//                                 >
//                                   {gc.name}
//                                 </Typography>
//                                 <Typography
//                                   variant="subtitle2"
//                                   className={classes.chatPrev}
//                                 >
//                                   {this.groupConvoMessage(gc.id, "message")}
//                                 </Typography>
//                               </div>

//                               <div className={classes.timeBadgeWrap}>
//                                 <Typography variant="caption">
//                                   {this.groupConvoMessage(gc.id, "time")}
//                                 </Typography>
//                                 <div style={{ marginTop: 3 }}>
//                                   <Badge
//                                     color="secondary"
//                                     badgeContent={this.unreadGroupChat(gc.id)}
//                                     invisible={
//                                       this.unreadGroupChat(gc.id) === 0
//                                         ? true
//                                         : false
//                                     }
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </Hidden>
//                           <Hidden smUp>
//                             <div className={classes.smBP}>
//                               <Avatar>
//                                 {" "}
//                                 <GroupIcon />{" "}
//                               </Avatar>
//                               <Badge
//                                 color="secondary"
//                                 badgeContent={this.unreadGroupChat(gc.id)}
//                                 invisible={
//                                   this.unreadGroupChat(gc.id) === 0
//                                     ? true
//                                     : false
//                                 }
//                               />
//                             </div>
//                           </Hidden>
//                         </ListItem>
//                         <Divider />
//                       </React.Fragment>
//                     );
//                   }
//                   return null;
//                 })}
//               </List>
//             </TabPanel>
//           </div>
//         </Paper>
//       </Grid>
//     );
//   }
// }

// export default withStyles(styles)(ChatPageList);
