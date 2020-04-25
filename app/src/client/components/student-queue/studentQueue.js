import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import BeingHelped from "../being-helped/BeingHelped";
import BeingHelpedModal from "../being-helped/beingHelpedModal";
import RemoveRequest from "../being-helped/removeRequestModal";
import StudentHeader from "./studentHeader";
import RequestQueue from "./requestQueue";
import StudentNavHeader from "./navHeader";
import StudentsList from "./studentsList";
import MentorProfile from "./mentorProfile";
import io from "socket.io-client";
import api from "../../services/fetchApi";
//LOADER
import Loader from "../common-components/loader/loader";
//AUTH
import AuthService from "../../auth/AuthService";
//added chatBox
// import ChatBox from "./chatBox";
import ClassroomBg from "../../images/classroomBg.jpg";
import ChatList from "../chat-box/chatList";
import ChatBox from "../chat-box/chatBox";
import $ from "jquery";

//end of added chatBox
const styles = theme => ({
  root: {
    height: "100%",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    padding: theme.spacing(3, 2),
    marginTop: "10px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#775aa5",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
    backgroundImage: `radial-gradient(25rem 18.75rem ellipse at bottom right, #883dca, transparent), url(${ClassroomBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  main: {
    marginTop: 4,
    "@media (max-width: 425px)": {
      display: "flex",
      flexFlow: "column"
    }
  },
  beingHelpMobile: {
    display: "none",
    "@media (max-width: 425px)": {
      order: "1",
      display: "block"
    }
  },
  beingHelp: {
    // marginTop: '15px',
    "@media (max-width: 425px)": {
      display: "none"
    }
  },
  chatList: {
    "@media (max-width: 425px)": {
      order: "3"
    }
  },
  requestQue: {
    "@media (max-width: 425px)": {
      order: "2"
    }
  },
  navHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerSpacer: {
    marginTop: 100,
    "@media (max-width: 425px)": {
      marginTop: 10
    }
  }
});

const socketUrl = "http://boom-handraiser.com:3001/";
const socket = io("http://boom-handraiser.com:3001/");

class Student extends PureComponent {
  constructor(props) {
    super(props);

    this.Auth = new AuthService();
    this.fetch = this.Auth.getFetchedTokenAPI();

    this.state = {
      loader: true,
      previledge: "",
      helpStudentModal: false,
      removeStudentReqModal: false,
      user: [],
      members: [],
      button: true,
      btntext: "Raise Hand",
      socket: null,
      member: "",
      helpingStudent: "",
      sub: "",
      requested: false,
      studentsReason: "",
      value: "",
      open: false,

      /*start of dded for chatBox state*/
      //chatBox: false, deleted
      //mentor_sub: "", deleted
      // chat: "",

      // senderInfo: [],
      // chatmateInfo: [],
      // chatM: "",
      // mentorInfo: [],
      /*end of added for chatBox state*/

      badge: false,

      //added dh

      conversation: [],

      chatmateSub: "",

      mentorChatBox: false,
      studentChatBox: false,

      studentChatText: "",
      mentorChatText: "",

      senderInfo: [],
      chatmateInfo: [],
      classHeaderImage: null,

      assist_id: "",
      assist: [],
      //end added dh

      //image chat
      imageChat: null,
      imageChatName: "",
      currently_helping: [],
      //end image chat
      helping: false
    };
  }




  deleteMessage = (id) => {
    const data = api.fetch(
      `/api/deleteMessage/${id}`,
      "delete"
    );
    data.then(res => {
      socket.emit("initialConversation", res.data);
    })
  }








  //added dh

  viewChatBox = () => {
    if (this.state.previledge === "student") {
      this.setState({ studentChatBox: false });
    } else {
      this.setState({ mentorChatBox: false });
    }
  };

  selectChatmate = chatmate_sub => {
    const data = api.fetch(
      `/api/displayChatUserInfo/${this.state.sub}/${chatmate_sub}`,
      "get"
    );
    data
      .then(res => {
        res.data.map(user => {
          if (user.sub === this.state.sub) {
            this.setState({ senderInfo: user });
          } else {
            this.setState({ chatmateInfo: user });
          }
          return null;
        });
        if (this.state.previledge === "mentor") {
          this.setState({ mentorChatBox: true, chatmateSub: chatmate_sub });
        } else {
          this.setState({ studentChatBox: true, chatmateSub: chatmate_sub });
        }
      })
      .then(() => {
        this.displayBadge();
        $("#focus").focus();
      });
  };

  setChatText = (val, receiversub, sendersub, type) => {
    let textVal = [val, receiversub, sendersub, type];
    let checkVal = "";
    setTimeout(() => {
      if (checkVal !== val) {
        checkVal = val;
      }
    }, 300);
    if (checkVal === textVal[0]) {
      if (this.state.previledge === "student") {
        socket.emit("handleChat", textVal);
      } else {
        socket.emit("handleChatM", textVal);
      }
    }
  };

  //ANCHOR send chat
  sendChat = (url, type, message) => {
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
      chatmate_sub: this.state.chatmateSub,
      cohort_id: this.props.cohort_id,
      time: datetime,
      type: type ? type : "text",
      link: url ? url : null
    };
    const data = api.fetch(`/api/sendChat`, "post", convo);
    this.setState({ value: this.state.sub });
    data.then(res => {
      $("#scrollDiv").animate(
        { scrollTop: $("#scrollDiv").prop("scrollHeight") },
        1000
      );
      socket.emit("sendChat", {
        chat: res.data,
        senderSub: this.state.sub,
        chatmateSub: this.state.chatmateSub
      });
    });
    socket.emit("displayBadge");
  };
  sendCode = (code, type) => {
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
      cohort_id: this.props.cohort_id,
      time: datetime,
      type: "code",
      link: type
    };
    const data = api.fetch(`/api/sendChat`, "post", convo);
    this.setState({ value: this.state.sub });
    data.then(res => {
      socket.emit("sendChat", {
        chat: res.data,
        senderSub: this.state.sub,
        chatmateSub: this.state.chatmateSub
      });
    });
    socket.emit("displayBadge");
  };
  //end added dh

  displayBadge() {
    let sub = { student: this.state.sub, mentor: this.state.chatmateSub };
    const data = api.fetch(
      `/api/seenChat/${this.state.previledge}`,
      "patch",
      sub
    );
    data.then(res => {
      socket.emit("seenChat", res.data);
    });
  }

  helpStudent = (memberid, assistid) => {
    const data = api.fetch(
      `/api/helpStudent/${memberid}/${this.props.cohort_id}/${assistid}`,
      "patch"
    );
    data.then(res => {
      // this.fetchAssist(memberid,assistid); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< request
      // console.log(res.data[0]);
      // this.setState(currently_helping);
      this.setState({ currently_helping: res.data });
      this.fetchStudents();
      socket.emit("helpStudent", res.data[0]);
      socket.emit("currentlyHelping", res.data);
    });
  };

  helpStudentClose = () => {
    socket.emit("close", "1");
    this.setState({ mentorChatBox: false }); //<<<<<<<<<<<<<<<<<<<<<<<<<<< SOCKET CLOSE CHAT BOX
  };

  removeStudentRequest = id => {
    this.setState({ removeStudentReqModal: true, member: id });
  };

  removeStudentReqClose = () => [
    this.setState({ removeStudentReqModal: false })
  ];

  UNSAFE_componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {});
    this.setState({ socket });

    //START OF BADGE

    socket.on("displayBadge", () => {
      this.setState({ badge: false });
    });

    socket.on("currentlyHelping", data => {
      // console.log(currentlyHelping)
      if (this.state.previledge === "student") {
        this.setState({ currently_helping: data });
      }
    });

    socket.on("handleChat", priv => {
      if (
        (priv[1] === this.state.sub && priv[2] === this.state.chatmateSub) ||
        (priv[2] === this.state.sub && priv[1] === this.state.chatmateSub)
      ) {
        if (!priv[3]) {
          this.setState({ studentChatText: priv[0] });
        } else {
          this.setState({ imageChat: priv[0], imageChatName: priv[3] });
        }
      }
    });

    socket.on("handleChatM", priv => {
      if (
        (priv[1] === this.state.sub && priv[2] === this.state.chatmateSub) ||
        (priv[2] === this.state.sub && priv[1] === this.state.chatmateSub)
      ) {
        if (!priv[3]) {
          this.setState({ mentorChatText: priv[0] });
        } else {
          this.setState({ imageChat: priv[0], imageChatName: priv[3] });
        }
      }
    });
    // END OF BADGE

    //start of socket chat
    socket.on("initialConversation", chat => {
      this.setState({
        conversation: [...chat]
      });
    });
    socket.on("seenChat", chat => {
      this.setState({
        conversation: [...chat]
      });
    });
    socket.on("sendChat", chat => {
      this.setState({
        conversation: [...chat.chat]
      });
      if (
        this.state.sub === chat.chatmateSub &&
        this.state.previledge === "student"
      ) {
        this.setState({ mentorChatText: "" });
      } else if (
        this.state.sub === chat.chatmateSub &&
        this.state.previledge === "mentor"
      ) {
        this.setState({ studentChatText: "" });
      }
      if (this.state.sub === chat.senderSub) {
        if (this.state.previledge === "student") {
          this.setState({ studentChatText: "" });
        } else {
          this.setState({ mentorChatText: "" });
        }
      }
    });

    //end of socket chat

    socket.on("requestHelping", students => {
      if (students[0].cohort_id === this.props.cohort_id) {
        this.setState({ members: students });
        if (students.length === 0) {
          this.setState({
            button: true,
            btntext: "Waiting for help",
            requested: true
          });
        }
        students.map(student => {
          if (student.sub === this.state.sub) {
            return this.setState({
              button: true,
              btntext: "Waiting for help",
              requested: true
            });
          } else {
            return null;
          }
        });
      }
    });

    socket.on("deleteRequest", studs => {
      const students = [...studs.members];
      if (studs.cohort === this.props.cohort_id) {
        this.setState({ members: students });
        if (students.length === 0) {
          this.setState({
            btntext: "Raise Hand",
            requested: false
          });
        }
        students.map(student => {
          if (student.sub !== this.state.sub) {
            return this.setState({
              btntext: "Raise Hand",
              requested: false
            });
          } else {
            return null;
          }
        });
      }
    });

    socket.on("helpStudent", students => {
      this.setState({
        // helpStudentModal: true,
        helpingStudent: students
      });
    });

    socket.on("close", cohort_id => {
      this.setState({
        helpingStudent: "",
        // helpStudentModal: false,
        button: true,
        requested: false,
        btntext: "Raise Hand",
        cohort_id: cohort_id
      });
      if (this.state.helpingStudent === "") {
        this.setState({
          helpStudentModal: false
        });
      }
      this.fetchStudents();
      this.fetchBeingHelped();
    });

    socket.on("displayStudents", students => {
      this.setState({
        members: students
      });
      if (this.state.members) {
        this.state.members.forEach(member => {
          if (parseInt(member.cohort_id) === parseInt(this.props.cohort_id)) {
            if (
              member.sub === this.state.sub &&
              member.status === "inprogress"
            ) {
              return this.setState({
                helpingStudent: member,
                button: true,
                btntext: "Currently Helping"
              });
            } else if (member.sub === this.state.sub) {
              return this.setState({
                button: true,
                btntext: "Waiting for help"
              });
            } else if (member.status === "inprogress") {
              this.setState({
                helpingStudent: member
              });
              //   {
              //   this.selectChatmate(member.sub);           //<< SOCKET ON CHATBOX
              // }
            } else {
              return null;
            }
          } else {
            return null;
          }
        });
      }
    });
  };

  fetchStudents = () => {
    const data = api.fetch(`/api/displayStudents/`, "get");
    data
      .then(res => {
        socket.emit("displayStudents", res.data);
      })
      .then(() => {
        const data1 = api.fetch(
          `/api/displayMentor/${this.props.cohort_id}`,
          "get"
        );
        data1.then(res => {
          this.setState({ mentorInfo: res.data });
        });
      })
      .then(() => {
        const data2 = api.fetch(`/api/getChat`, "get");
        data2.then(res => {
          socket.emit("initialConversation", res.data);
        });
      });
  };

  fetchAssist = mentor_id => {
    api.fetch(`/api/fetchAssist/${mentor_id}`, "get").then(data => {
      if (data.data.length) {
        this.setState({ helping: true });
      } else {
        this.setState({ helping: false });
      }

      data.data.map(val => {
        this.setState({ assist: val });
        return null;
      });
    });
  };

  componentDidMount() {
    this.setState({ loader: true });
    this.fetch
      .then(fetch => {
        const user = fetch.data.user[0];
        this.setState({ sub: user.sub, assist_id: user.id });

        const data = api.fetch(
          `/api/displayUserInfo/${user.sub}/${this.props.cohort_id}`,
          "get"
        );
        data
          .then(res => {
            if (res.data[0][0].privilege === "mentor") {
              api
                .fetch(`/api/fetchAssist/${user.id}`, "get")
                .then(data => {
                  if (data.data.length) {
                    this.setState({ helping: true });
                    this.selectChatmate(data.data[0].sub);
                  } else {
                    this.setState({ helping: false });
                  }
                  data.data.map(val => {
                    this.setState({ assist: val });
                    return null;
                  });
                })
                .catch(err => {
                  window.location.href = "../404";
                });
            }
            this.setState({
              user: res.data[0],
              previledge: res.data[0][0].privilege
            });
            data.then(() => {
              this.fetchStudents();

              setTimeout(() => {
                this.setState({ loader: false });
              }, 1000);
            });
          })
          .catch(err => {
            window.location.href = "../404";
          });
      })
      .catch(err => {
        window.location.href = "../404";
      });

    api
      .fetch(`/specific/${this.props.cohort_id}`, "get")
      .then(res => {
        if (res.data.length === 0) {
          window.location.href = "../404";
        }
        this.setState({ classHeaderImage: res.data[0].class_header });
      })
      .catch(err => {
        window.location.href = "../404";
      });

    this.fetchBeingHelped();
  }

  fetchBeingHelped = () => {
    api
      .fetch(`/api/studentBeingHelped/${this.props.cohort_id}`, "get")
      .then(res => {
        this.setState({ currently_helping: res.data });
      });
  };

  requestHelp = () => {
    const data = api.fetch(
      `/api/requestHelp/${this.state.sub}/${this.props.cohort_id}`,
      "post",
      { reason: this.state.studentsReason }
    );
    data
      .then(res => {
        socket.emit("requestHelp", res.data);
      })
      .then(() => {
        this.fetchStudents();
      });
  };

  moveToQueue = sub => {
    const data = api.fetch(
      `/api/requestHelp/${sub}/${this.props.cohort_id}`,
      "post",
      { reason: "" }
    );
    data
      .then(res => {
        socket.emit("requestHelp", res.data);
      })
      .then(() => {
        this.fetchStudents();
      });
  };

  deleteRequest = id => {
    const data = api.fetch(
      `/api/deleteRequest/${id}/${this.props.cohort_id}`,
      "delete"
    );
    data
      .then(res => {
        socket.emit("deleteRequest", {
          members: res.data,
          cohort: this.props.cohort_id
        });
      })
      .then(() => {
        this.fetchStudents();
      });
  };

  handleChangeReasons = e => {
    const reasonValue = e.target.value.replace(/^\s+/, "").replace(/\s+$/, "");
    if (reasonValue !== "") {
      this.setState({
        button: false,
        studentsReason: e.target.value
      });
    } else {
      this.setState({
        button: true
      });
    }
  };
  //* STUDENT QUEUE FCUNTIONS *//

  //* CLASS HEADER IMAGE *//
  setToDefaultHeader = () => {
    api.fetch(`/setToDefault/${this.props.cohort_id}`, "get").then(res => {
      this.setState({ classHeaderImage: null });
      this.componentDidMount();
    });
  };

  loadState = () => {
    api.fetch(`/specific/${this.props.cohort_id}`, "get").then(res => {
      this.setState({ classHeaderImage: res.data[0].class_header });
    });
  };
  //* CLASS HEADER IMAGE *//

  //randomid

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.loader ? (
          <Loader content="Loading Queue..." />
        ) : (
          <div>
            <div className={classes.root}>
              {this.state.user.length !== 0 ? (
                <React.Fragment>
                  {this.state.previledge === "mentor" ? (
                    <Paper
                      className={classes.header}
                      style={
                        this.state.classHeaderImage !== null
                          ? {
                              backgroundImage: `radial-gradient(171rem 28.75rem at right bottom, rgba(97, 95, 95, 0.82), rgba(120, 10, 175, 0)), url(${this.state.classHeaderImage})`
                            }
                          : {
                              backgroundImage: require(`../../images/cardBg.jpg`)
                            }
                      }
                    >
                      <StudentHeader
                        setToDefaultHeaderFn={this.setToDefaultHeader}
                        classHeaderImage={this.state.classHeaderImage}
                        loadStateFn={this.loadState}
                        user={this.state.user[0]}
                        cohortId={this.props.cohort_id}
                      />
                    </Paper>
                  ) : (
                    <Paper
                      className={classes.header}
                      style={
                        this.state.classHeaderImage !== null
                          ? {
                              backgroundImage: `radial-gradient(171rem 28.75rem at right bottom, rgba(97, 95, 95, 0.82), rgba(120, 10, 175, 0)), url(${this.state.classHeaderImage})`
                            }
                          : {
                              backgroundImage: require(`../../images/cardBg.jpg`)
                            }
                      }
                    >
                      <StudentHeader
                        setToDefaultHeaderFn={this.setToDefaultHeader}
                        classHeaderImage={this.state.classHeaderImage}
                        loadStateFn={this.loadState}
                        user={this.state.user[0]}
                        cohortId={this.props.cohort_id}
                        raise={this.state.btntext}
                        btn={this.state.button}
                        requestHelp={this.requestHelp}
                        privilege={this.state.previledge}
                      />
                    </Paper>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment />
              )}

              <Grid container className={classes.main} spacing={1}>
                <Grid item xs={12} sm={4} className={classes.beingHelpMobile}>
                  {this.state.previledge === "mentor" ? null : (
                    <React.Fragment>
                      <Box order={1}>
                        <BeingHelped
                          helpingStudent={this.state.helpingStudent}
                          cohort_id={this.props.cohort_id}
                          currentlyHelping={this.state.currently_helping}
                        />
                      </Box>
                    </React.Fragment>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} className={classes.chatList}>
                  {this.state.previledge === "mentor" ? (
                    <div>
                      <BeingHelpedModal
                        fetchStudents={this.fetchStudents}
                        helpStudentModal={this.state.helpStudentModal}
                        helpStudentClose={this.helpStudentClose}
                        helpingStudent={this.state.helpingStudent}
                        cohort_id={this.props.cohort_id}
                        chatM={this.state.mentorChatText}
                        handleChatM={this.setChatText}
                        sendChatM={this.sendChat}
                        conversation={this.state.conversation}
                        senderInfo={this.state.senderInfo}
                        chatmateInfo={this.state.chatmateInfo}
                        previledge={this.state.previledge}
                        sendChatSubM={this.selectChatmate}
                        /*BADGE*/ displayBadge={this.displayBadge}
                        chat={this.state.studentChatText}
                      />
                      <MentorProfile
                        user={this.state.user[0]}
                        members={this.state.members}
                        cohort_id={this.props.cohort_id}
                      />
                      <StudentsList
                        cohort_id={this.props.cohort_id}
                        members={this.state.members}
                        moveToQueue={this.moveToQueue}
                        conversation={this.state.conversation}
                        sub={this.state.sub}
                        badge={this.state.badge}
                        sendChatSub={this.selectChatmate}
                      />

                      <RemoveRequest
                        deleteRequest={this.deleteRequest}
                        member={this.state.member}
                        removeStudentReqModal={this.state.removeStudentReqModal}
                        removeStudentReqClose={this.removeStudentReqClose}
                      />
                    </div>
                  ) : (
                    <React.Fragment>
                      <Box order={1}>
                        <div className={classes.beingHelp}>
                          <BeingHelped
                            helpingStudent={this.state.helpingStudent}
                            cohort_id={this.props.cohort_id}
                            currentlyHelping={this.state.currently_helping}
                          />
                        </div>

                        <ChatList
                          sendChatSub={this.selectChatmate}
                          mentor={this.state.mentorInfo}
                          conversation={this.state.conversation}
                          sub={this.state.sub}
                          badge={this.state.badge}
                          cohort_id={this.props.cohort_id}
                        />
                      </Box>
                    </React.Fragment>
                  )}

                  {this.state.previledge === "student" ? (
                    <RemoveRequest
                      member={this.state.member}
                      removeStudentReqModal={this.state.removeStudentReqModal}
                      removeStudentReqClose={this.removeStudentReqClose}
                      deleteRequest={this.deleteRequest}
                    />
                  ) : null}
                </Grid>
                {/* start of chatBox */}
                {this.state.studentChatBox &&
                this.state.previledge === "student" ? (
                  <React.Fragment>
                    <Grid item xs={12} sm={8}>
                      <ChatBox
                        studentReason={this.state.studentsReason}
                        cohort_id={this.props.cohort_id}
                        sendChat={this.sendChat}
                        handleChat={this.setChatText}
                        chat={this.state.studentChatText}
                        chatM={this.state.mentorChatText}
                        conversation={this.state.conversation}
                        senderInfo={this.state.senderInfo}
                        chatmateInfo={this.state.chatmateInfo}
                        privileged={this.state.previledge}
                        viewChatBox={this.viewChatBox}
                        /*BADGE*/ displayBadge={this.displayBadge}
                        allowChat={
                          this.state.btntext === "Currently Helping"
                            ? true
                            : false
                        }
                        sendChatSub={this.selectChatmate}
                        //send code
                        sendCode={this.sendCode}
                        deleteMessage={this.deleteMessage}
                      />
                    </Grid>
                  </React.Fragment>
                ) : this.state.mentorChatBox &&
                  this.state.previledge === "mentor" ? (
                  <React.Fragment>
                    <Grid item xs={12} sm={8}>
                      <ChatBox
                        viewChatBox={this.viewChatBox}
                        sendChatM={this.sendChat}
                        handleChatM={this.setChatText}
                        chatM={this.state.mentorChatText}
                        conversation={this.state.conversation}
                        senderInfo={this.state.senderInfo}
                        chatmateInfo={this.state.chatmateInfo}
                        privileged={this.state.previledge}
                        helpingStudent_sub={this.state.helpingStudent.sub}
                        cohort_id={this.props.cohort_id}
                        chat={this.state.studentChatText}
                        displayBadge={this.displayBadge}
                        helpStudentClose={this.helpStudentClose}
                        helpingStudent={this.state.helpingStudent}
                        sendChatSub={this.selectChatmate}
                        fetchAssist={this.fetchAssist}
                        //send code
                        sendCode={this.sendCode}
                        deleteMessage={this.deleteMessage}
                      />
                    </Grid>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Grid item xs={12} sm={8}>
                      {this.state.previledge === "mentor" ? null : (
                        <div style={{ marginTop: "-16px" }}>
                          <StudentNavHeader
                            user={this.state.user[0]}
                            cohort={this.props.cohort_id}
                            raise={this.state.btntext}
                            requested={this.state.requested}
                            handleChangeReasons={this.handleChangeReasons}
                          />
                        </div>
                      )}
                      <RequestQueue
                        sendChatSub={this.selectChatmate}
                        cohort_id={this.props.cohort_id}
                        sub={this.state.sub}
                        priv={this.state.previledge}
                        helpStudentModal={this.state.helpStudentModal}
                        helpStudentClose={this.helpStudentClose}
                        helpStudent={this.helpStudent}
                        removeStudentRequest={this.removeStudentRequest}
                        removeStudentReqModal={this.state.removeStudentReqModal}
                        removeStudentReqClose={this.removeStudentReqClose}
                        members={this.state.members}
                        assist_id={this.state.assist_id}
                        fetchAssist={this.fetchAssist}
                        helping={this.state.helping}
                      />
                    </Grid>
                  </React.Fragment>
                )}
                {/* end of chatBox */}
              </Grid>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Student);
