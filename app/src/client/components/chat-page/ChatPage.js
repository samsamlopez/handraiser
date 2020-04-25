import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./ChatPageStyle";

//NAVIGATION
import NavBar from "../common-components/nav-bar/navBar";
import SideNav from "../common-components/side-nav/sideNav";

//MAIN
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

//COMPONENTS
import ChatPageList from "./ChatPageList";
import ChatPageBox from "./ChatPageBox";
import ChatPageInfo from "./ChatPageInfo";

import api from "../../services/fetchApi";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import $ from "jquery";

import AuthService from "../../auth/AuthService";

const socket = io("http://boom-handraiser.com:3001/");

class ChatPage extends PureComponent {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.fetch = this.Auth.getFetchedTokenAPI();
    this.state = {
      open: false,
      conversation: [],
      sub: "",

      chatmateSub: "",

      userInfo: [],
      chatmateInfo: [],

      senderText: "",
      chatmateText: "",

      chatListInfo: [],

      newChatmateSub: "",

      groupListInfo: [],
      groupConversation: [],
      refreshChatmate: false,
      notInGroup: false,
      groupMembers: [],
      groupShow: 7,
    };
  }

  handleDrawerOpen = () => this.setState({ open: true });
  handleDrawerClose = () => this.setState({ open: false });





  deleteMessage = (id) => {
    if(id[1] === "pm"){
    const data = api.fetch(
      `/api/deleteMessage/${id[0]}`,
      "delete"
    );
    data.then(res => {
        socket.emit("getNormalChat", [res.data, this.state.sub, this.state.chatmateSub]);
      })
    }
    else {
      const data = api.fetch(
        `/api/deleteGroupMessage/${id[0]}`,
        "delete"
      );
      data.then(res => {
          socket.emit("getNormalGroupChat", [res.data, this.state.sub, this.state.chatmateSub]);
        })
    }
  }









  componentDidMount() {
    setTimeout(() => {
      $('#scrollDiv').scrollTop($('#scrollDiv')[0].scrollHeight);
    }, 1000);
    
    //START OF UPDATED FOR FASTER CHATTING
    socket.on("getNormalChat", conversation => {
      if (conversation[1] === this.state.sub) {
        if(conversation[3] === 'compose'){
           this.displayChatList();
        }
        this.setState({ senderText: "", chatmateSub: conversation[2], newChatmateSub:conversation[2], conversation:[...conversation[0]]});
      } else if (conversation[1] === this.state.chatmateSub) {
        if(conversation[3] === 'compose'){
          this.displayChatList();
       }
        this.setState({ chatmateText: "", conversation:[...conversation[0]] });
      }
      if (conversation[2] === this.state.sub) {
        if(conversation[3] === 'compose'){
          this.displayChatList();
       }
       this.setState({conversation:[...conversation[0]]})
      }
    });

    //END OF UPDATED FOR FASTER CHATTING

    socket.on("setStudentChatText", chatText => {
      if (
        chatText[2] === this.state.sub &&
        chatText[1] === this.state.chatmateSub
      ) {
        this.setState({ senderText: chatText[0] });
      } else if (
        chatText[1] === this.state.sub &&
        chatText[2] === this.state.chatmateSub
      ) {
        this.setState({ chatmateText: chatText[0] });
      }
    });

    socket.on("seenNormalChat", chat => {
      this.setState({
        conversation: [...chat]
      });
    });

    socket.on("getNormalGroupChat", conversation => {
      this.setState({ groupConversation: conversation[0] });

      if (conversation[1] === this.state.sub) {
        this.setState({ senderText: ""})
      } else if (conversation[2] === this.state.chatmateSub) {
        this.setState({ chatmateText: ""});
      }
    });

    socket.on("seenNormalGroupChat", chat => {
      this.getGroupConversation();
    });

    socket.on("createGroupChat", groupChat => {
      this.displayGroupList();
    });

    socket.on("chatGroupList", groupChat => {
      this.displayGroupList();
    });

    socket.on("inactiveChat", groupChat => {
      this.displayChatList();
    });

    socket.on("activeChat", groupChat => {
      this.displayChatList();
    });
    socket.on("groupMembers", group => {
      this.displayGroupMembers();
    });

    //CREATE SOCKET ON SELECT CHATMATE
    socket.on("refreshGroupName", sub => {
      if (
        sub[0] === this.state.sub ||
        sub[1] === parseInt(this.props.match.params.chatmateSub)
      ) {
        this.setState({ refreshChatmate: true });
        this.editGroupName(this.props.match.params.chatmateSub);
      }
    });

    socket.on("setStudentGroupChatText", chatText => {
      if (
        chatText[2] === this.state.sub &&
        chatText[1] === this.state.chatmateSub
      ) {
        this.setState({ senderText: chatText[0] });
      } else if (
        chatText[2] !== this.state.sub &&
        chatText[1] === this.state.chatmateSub
      ) {
        this.setState({ chatmateText: chatText[0] });
      }
    });

    if (this.props.match.params.chatmateSub !== "allMessages") {
      api
        .fetch(
          `/api/chat/checkParams/${this.props.match.params.chatmateSub}`,
          "get"
        )
        .then(res => {
          if (res.data === "error") {
            window.location.href = "../404";
          }
        });
    }

    this.fetch
      .then(fetch => {
        this.setState({
          sub: fetch.data.user[0].sub,
          userInfo: fetch.data.user[0]
        });
      })
      .then(() => {
        this.getConversation();
        this.getGroupConversation();
        this.displayGroupList();
        this.displayChatList("allMessages");
        this.displayGroupMembers();
      })
      .then(() => {
        if (this.props.match.params.chatmateSub === "allMessages") {
          this.displayChatList("allMessages");
        } else {
          this.setState({
            chatmateSub: this.props.match.params.chatmateSub,
            newChatmateSub: this.props.match.params.chatmateSub
          });

        }
      })
      .catch(err => {
        window.location.href = "../404";
      });
  }

  displayChatList = view => {
    let sub = [];
    let UniqueSub = [];
    const data = api.fetch(`/api/getChatList/${this.state.sub}`, "get");
    data
      .then(res => {
        res.data.forEach(chatListSub => {
          sub.push(chatListSub.chatsub);
        });
      })
      .then(() => {
        UniqueSub = [...new Set(sub)];
      })
      .then(() => {
        if (UniqueSub.length !== 0) {
          api
            .fetch(`/api/getChatListInformation/${UniqueSub}`, "get")
            .then(res => {
              this.selectChatmate(res.data[0].sub)
              this.setState({ 
                chatListInfo: [...res.data],
                chatmateInfo: res.data[0]
              });
            })
            .catch(() => {
              this.displayChatList();
            });
        } /*else {
          this.displayGroupList();
          this.getGroupConversation();
        }*/
      })
      .then(() => {
        if (view === "allMessages" && UniqueSub.length > 0) {
          this.setState({
            chatmateSub: UniqueSub[0],
            newChatmateSub: UniqueSub[0],
          })
          this.displayGroupList();
          this.getGroupConversation();
        }
      });
  };

  componentDidUpdate(sub) {
    if (this.props.match.params.chatmateSub === "allMessages") {
      if (sub.length > 0) {
        this.setState({ chatmateSub: sub, newChatmateSub: sub });
        //this.getConversation();
        //this.selectChatmate(sub);
        //this.displayGroupList();
        //this.getGroupConversation();
      }
    } else {
      this.setState({
        chatmateSub: this.props.match.params.chatmateSub,
        newChatmateSub: this.props.match.params.chatmateSub
      });
      if(this.state.chatmateSub !== this.props.match.params.chatmateSub){
        this.selectChatmate(this.props.match.params.chatmateSub);
      }
    }
  }

  changeChatmate = chatmate => {
    this.setState({ newChatmateSub: chatmate });
  };

  selectChatmate = chatmateSub => {
    if (this.state.chatmateSub !== this.props.match.params.chatmateSub) {
      if (chatmateSub.length > 15) {
        const data = api.fetch(
          `/api/getChatUsersInfo/${this.state.sub}/${chatmateSub}`,
          "get"
        );
        data.then(res => {
          this.setState({ chatmateSub: chatmateSub });
          res.data.map(chatUser => {
            if (chatUser.sub === this.state.sub) {
              this.setState({ userInfo: chatUser });
            } else {
              this.setState({ chatmateInfo: chatUser });
            }
            return null;
          });
        });
      } else {
        const data = api.fetch(`/api/getGroupChatInfo/${chatmateSub}`, "get");
        data.then(res => {
          this.setState({ chatmateSub: chatmateSub, chatmateInfo: res.data });
        });
        this.displayGroupMembers();
      }
    } 
    if (this.state.groupShow === 7) {
      $("#focus").focus();
    }
  };


  editGroupName = (chatmateSub) => {
    if (this.state.refreshChatmate) {
      if (chatmateSub.length > 15) {
        const data = api.fetch(
          `/api/getChatUsersInfo/${this.state.sub}/${chatmateSub}`,
          "get"
        );
        data.then(res => {
          this.setState({ chatmateSub: chatmateSub });
          res.data.map(chatUser => {
            if (chatUser.sub === this.state.sub) {
              this.setState({ userInfo: chatUser });
            } else {
              this.setState({ chatmateInfo: chatUser });
            }
            return null;
          });
        });
      } else {
        const data = api.fetch(`/api/getGroupChatInfo/${chatmateSub}`, "get");
        data.then(res => {
          this.setState({ chatmateSub: chatmateSub, chatmateInfo: res.data });
        });
      }
      this.setState({ refreshChatmate: false });
    }
  }

  //START OF UPDATED FOR FASTER CHATTING
  getConversation = () => {
    const data = api.fetch(`/api/getNormalChat/${this.state.sub}`, "get");
    data.then(res => {
      this.setState({ conversation: [...res.data] });
    });
  };
  //END OF UPDATED FOR FASTER CHATTING

  getGroupConversation = () => {
    const data = api.fetch(`/api/getGroupChat`, "get");
    data.then(res => {
      this.setState({ groupConversation: [...res.data] });
    });
  };

  setChatText = (val, type) => {
    let textVal = [val, this.state.chatmateSub, this.state.sub];
    if (type === "pm") {
      socket.emit("setStudentChatText", textVal);
    } else {
      socket.emit("setStudentGroupChatText", textVal);
    }
  };

  sendChat = (url, message, type, sub, compose) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let current_datetime = new Date();
    let formatted_date =
      months[current_datetime.getMonth()] +
      " " +
      current_datetime.getDate() +
      ", " +
      current_datetime.getFullYear();
    var time = current_datetime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    var datetime = formatted_date + " " + time;
    let convo = {
      message,
      sender_sub: this.state.sub,
      chatmate_sub: sub ? sub : this.state.chatmateSub,
      time: datetime,
      type: type ? type : "text",
      link: url ? url : null
    };
    const data = api.fetch(`/api/sendStudentChat`, "post", convo);
    data
      .then(res => {
        const chat = [res.data, this.state.sub, sub ? sub : this.state.chatmateSub, compose];
        socket.emit("getNormalChat", chat);
        //socket.emit("countUnreadMessages", chat);
      })
    $("#scrollDiv").animate(
      { scrollTop: $("#scrollDiv").prop("scrollHeight") },
      1000
    );
  };
  sendCode = (code, mode) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let current_datetime = new Date();
    let formatted_date =
      months[current_datetime.getMonth()] +
      " " +
      current_datetime.getDate() +
      ", " +
      current_datetime.getFullYear();
    var time = current_datetime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    var datetime = formatted_date + " " + time;
    let convo = {
      message: code,
      sender_sub: this.state.sub,
      chatmate_sub: this.state.chatmateSub,
      time: datetime,
      type: "code",
      link: mode
    };
    const data = api.fetch(`/api/sendStudentChat`, "post", convo);
    data.then(res => {
      const chat = [res.data, this.state.sub, this.state.chatmateSub];
      socket.emit("getNormalChat", chat);
    });
    $("#scrollDiv").animate(
      { scrollTop: $("#scrollDiv").prop("scrollHeight") },
      1000
    );
  };
  sendCodeGroup = (code, mode) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let current_datetime = new Date();
    let formatted_date =
      months[current_datetime.getMonth()] +
      " " +
      current_datetime.getDate() +
      ", " +
      current_datetime.getFullYear();
    var time = current_datetime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    var datetime = formatted_date + " " + time;
    let convo = {
      sender_sub: this.state.sub,
      groupchat_id: parseInt(this.state.chatmateSub),
      message: code,
      time: datetime,
      type: "code",
      link: mode
    };
    const data = api.fetch(`/api/sendGroupChat`, "post", convo);
    data.then(res => {
      const chat = [res.data, this.state.sub, this.state.chatmateSub];
      socket.emit("getNormalGroupChat", chat);
    });
    $("#scrollDiv").animate(
      { scrollTop: $("#scrollDiv").prop("scrollHeight") },
      1000
    );
  };
  //ANCHOR  GROUP CHAT SEND
  sendChatGroup = (url, type, message) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let current_datetime = new Date();
    let formatted_date =
      months[current_datetime.getMonth()] +
      " " +
      current_datetime.getDate() +
      ", " +
      current_datetime.getFullYear();
    var time = current_datetime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    var datetime = formatted_date + " " + time;
    let convo = {
      sender_sub: this.state.sub,
      groupchat_id: parseInt(this.state.chatmateSub),
      message,
      time: datetime,
      type: type ? type : "text",
      link: url ? url : null
    };
    const data = api.fetch(`/api/sendGroupChat`, "post", convo);
    data.then(res => {
      const chat = [res.data, this.state.sub, this.state.chatmateSub];
      socket.emit("getNormalGroupChat", chat);
      //socket.emit("countUnreadMessages", chat);
    });
    $("#scrollDiv").animate(
      { scrollTop: $("#scrollDiv").prop("scrollHeight") },
      1000
    );
  };

  displayBadge = (chatmate, type) => {
    if (type === "pm") {
      let sub = { chatmate: this.state.sub, sender: chatmate };
      const data = api.fetch(`/api/seenNormalChat`, "patch", sub);
      data.then(res => {
        this.setState({conversation: [...res.data]})
        // socket.emit("seenNormalChat", res.data);
        socket.emit("countUnreadMessages", res.data);
      });
    } else if (type === "gc") {
      let sub = { chatmate: this.state.sub, groupchat_id: chatmate };
      const data = api.fetch(`/api/seenNormalGroupChat`, "patch", sub);
      data.then(res => {
        this.setState({groupConversation: [...res.data]})
        // socket.emit("seenNormalGroupChat", res.data);
        socket.emit("countUnreadMessages", res.data);
      });
    }
  };

  displayGroupList = () => {
    const data = api.fetch(`/api/getGroupList/${this.state.sub}`, "get");
    data.then(res => {
      this.setState({ groupListInfo: res.data });
      //map
    });
  };

  displayGroupMembers = () => {
    const data = api.fetch(
      `/api/getAllUsersInGroup/${this.props.match.params.chatmateSub}`
    );
    data.then(res => {
      this.setState({ groupMembers: res.data });
    });
  };

  //ANCHOR SHOW MORE GROUP
  showMoreGroup = () => {
    if (this.state.groupConversation.length - this.state.groupShow <= 4) {
      this.setState({
        groupShow: this.state.groupConversation.length - 1
      });
    } else {
      this.setState({
        groupShow: this.state.groupShow + 4
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <NavBar
          open={this.state.open}
          title="Handraiser"
          handleDrawerOpenFn={this.handleDrawerOpen}
        />
        <SideNav
          open={this.state.open}
          handleDrawerCloseFn={this.handleDrawerClose}
        />

        <Container maxWidth="xl" className={classes.container}>
          <Grid
            container
            spacing={2}
            style={{ height: "800px", maxHeight: "700px" }}
          >
            <ChatPageList
              groupListInfo={this.state.groupListInfo}
              chatListInfo={this.state.chatListInfo}
              conversation={this.state.conversation}
              sub={this.state.sub}
              userInfo={this.state.userInfo}
              changeChatmate={this.changeChatmate}
              displayBadge={this.displayBadge}
              selectChatmate={this.selectChatmate}
              chatmateInfo={this.state.chatmateInfo}
              sendChat={this.sendChat}
              groupConversation={this.state.groupConversation}
            />
            <ChatPageBox
              chatListInfo={this.state.chatListInfo}
              paramsCheck={this.props.match.params.chatmateSub}
              userInfo={this.state.userInfo}
              chatmateInfo={this.state.chatmateInfo}
              senderText={this.state.senderText}
              setChatText={this.setChatText}
              sendChat={this.sendChat}
              conversation={this.state.conversation}
              chatmateText={this.state.chatmateText}
              displayBadge={this.displayBadge}
              groupConversation={this.state.groupConversation}
              sendChatGroup={this.sendChatGroup}
              sendCode={this.sendCode}
              sendCodeGroup={this.sendCodeGroup}
              groupListInfo={this.state.groupListInfo}
              refreshComponent={this.selectChatmate}
              notInGroup={this.state.notInGroup}
              //gc convo slice
              groupShow={this.state.groupShow}
              pmShow={this.state.pmShow}
              showMoreGroup={this.showMoreGroup}
              //gc convo slice end
              deleteMessage={this.deleteMessage}
            />
            <ChatPageInfo
              userInfo={this.state.userInfo}
              chatmateInfo={this.state.chatmateInfo}
              conversation={[...this.state.conversation].reverse()}
              groupConversation={[...this.state.groupConversation].reverse()}
              groupMembers={this.state.groupMembers}
              groupChatId={this.props.match.params.chatmateSub}
              refreshMember={this.displayGroupMembers}
            />
          </Grid>
        </Container>

        {this.state.newChatmateSub !== this.state.chatmateSub ? (
          <Redirect
            to={{
              pathname: `/chat/${this.state.newChatmateSub}`
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(ChatPage);
