import React, { PureComponent } from "react";
import { withStyles, lighten } from "@material-ui/core/styles";
import MoreSettings from "@material-ui/icons/MoreVert";
import SendIcon from "@material-ui/icons/Send";
import Close from "@material-ui/icons/Close";
import BackToQueue from "@material-ui/icons/SettingsBackupRestore";
import Done from "@material-ui/icons/Done";
import styles from "./chatBoxStyle";
import TypingEffect from "./typingEffect";
import Photo from "@material-ui/icons/Photo";
import Dialog from "@material-ui/core/Dialog";
import ConfirmationDialog from "../being-helped/doneCofirmationmodal";
import TextareaAutosize from "react-textarea-autosize";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//api
import api from "../../services/fetchApi";

import { InputAdornment } from "@material-ui/core";
import InsertEmoticon from "@material-ui/icons/InsertEmoticon";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import {
  Link,
  Paper,
  Grid,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

//menu
import ImageMenu from "./imageMenu";

//splash
import Splash from "./plugins/giphy";

//emoji
import Emoji from "./plugins/emoji";

//gallery
import Gallery from "../chat-page/gallery/galleryDialog";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import Snippet from "../chat-page/snippet/snippet";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/github";
import "brace/theme/dracula";
import S3FileUpload from "react-s3";

const imageConfig = {
  bucketName: "boomcamp",
  dirName: "handraiser/image-uploads/chat-images",
  region: "us-west-2",
  accessKeyId: "AKIAQQHQFF5EPNACIXE3",
  secretAccessKey: "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"
};
const documentConfig = {
  bucketName: "boomcamp",
  dirName: "handraiser/file-uploads",
  region: "us-west-2",
  accessKeyId: "AKIAQQHQFF5EPNACIXE3",
  secretAccessKey: "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"
};

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const Progress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten("#775aa5", 0.5)
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#775aa5"
  }
})(LinearProgress);

// UPLOAD IMAGE ATTRIBUTES
const imageMaxSize = 1000000000; // bytes
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

const acceptedDocuments =
  "text/css, text/html, application/json, text/javascript, text/plain, application/xhtml+xml, application/zip, application/pdf";
const acceptedDocumentsArray = acceptedDocuments.split(",").map(item => {
  return item.trim();
});

class ChatBox extends PureComponent {
  constructor(props) {
    super(props);
    //ANCHOR state
    this.state = {
      confirmationDialog: false,
      openMenu: null,
      image: null,
      progress: false,
      assist: [],
      imageMenu: null,
      splashDialog: false,
      emoji: false,
      //gallery
      openGallery: false,
      selected: null,
      imgArray: [],
      document: null,
      openSnippet: false,
      studentChat: "",
      chatMenu: null,
      messageId: null,
    };
  }
  openSnippet = () => {
    this.setState({ openSnippet: !this.state.openSnippet });
  };
  handleImageMenu = event => {
    this.setState({ imageMenu: event.currentTarget });
  };
  handleImageMenuClose = () => {
    this.setState({ imageMenu: null });
  };
  handleSplash = () => {
    this.setState({ splashDialog: true });
  };
  closeSplash = () => {
    this.setState({ splashDialog: false });
  };
  componentDidMount() {
    if (this.props.privileged === "mentor") {
      api
        .fetch(`/api/fetchAssist/${this.props.senderInfo.id}`, "get")
        .then(data => {
          this.props.fetchAssist(this.props.senderInfo.id);
          data.data.forEach(val => {
            this.setState({ assist: val });
          });
        });
    }
  }
  handleClick = e => {
    this.setState({ openMenu: e.currentTarget });
  };
  handleClose = () => {
    this.setState({ openMenu: null });
  };
  openConfirmationDialog = () => this.setState({ confirmationDialog: true });
  closeConfirmationDialog = () => this.setState({ confirmationDialog: false });
  removeFromQueue = student => {
    const data = api.fetch(
      `/api/removebeinghelped/${student.user_id}/${this.props.cohort_id}`,
      "get"
    );
    data.then(res => {
      this.props.helpStudentClose();
      this.props.fetchAssist(this.props.senderInfo.id);
    });
  };
  doneHelp = student => {
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
    const data = api.fetch(
      `/api/doneHelp/${student.user_id}/${this.props.cohort_id}/${this.props.senderInfo.id}`,
      "post",
      { time: datetime }
    );
    data.then(res => {
      this.props.helpStudentClose();
      this.props.fetchAssist(this.props.senderInfo.id);
      this.setState({ confirmationDialog: false });
    });
  };
  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;

      if (currentFileSize > imageMaxSize) {
        toast.error("This file is too large!", {
          hideProgressBar: true,
          draggable: false
        });
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        toast.error("This file type is not allowed", {
          hideProgressBar: true,
          draggable: false
        });
        return false;
      }
      return true;
    }
  };
  handleUpload = event => {
    if (event.target.files) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const isVerified = this.verifyFile(files);
        if (isVerified) {
          this.setState({
            image: files[0]
          });
          if (this.props.privileged === "student") {
            this.studentInput.value = files[0].name;
          } else {
            this.mentorInput.value = files[0].name;
          }
        }
      }
    }
  };
  handleSendImage = priv => {
    const { image } = this.state;
    const imageName = this.makeid(image.name);
    this.setState({ progress: true });
    S3FileUpload.uploadFile(image, imageConfig)
      .then(data => {
        if (priv === "student") {
          this.props.sendChat(data.location, "image", imageName);
          this.studentInput.value = "";
        } else {
          this.props.sendChatM(data.location, "image", imageName);
          this.mentorInput.value = "";
        }
      })
      .then(() => {
        this.setState({ progress: false });
        this.setState({ image: null });
      })
      .catch(err => {
        console.log(err);
      });
    this.fileInput.value = "";
  };
  makeid = (name, length = 15) => {
    var ext = name.replace(/^.*\./, "");
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + "." + ext;
  };
  cancelUpload = () => {
    this.setState({
      image: null
    });
  };
  uploadGif = gif => {
    this.closeSplash();
    if (this.props.privileged === "student") {
      this.props.sendChat(gif.images.downsized.url, "gif", " ");
    } else {
      this.props.sendChatM(gif.images.downsized.url, "gif", " ");
    }
  };
  openPicker = event => {
    if (!event) {
      this.setState({ emoji: null });
    } else {
      if (this.state.emoji) {
        this.setState({ emoji: null });
      } else {
        this.setState({ emoji: event.currentTarget });
      }
    }
  };
  handleEmoji = emoji => {
    if (this.props.privileged === "student") {
      this.studentInput.value = this.studentInput.value + emoji.native;
    } else {
      this.mentorInput.value = this.mentorInput.value + emoji.native;
    }
  };
  handleDocumentUpload = event => {
    if (event.target.files) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const isVerified = this.verifyDocument(files);
        if (isVerified) {
          this.setState({
            document: files[0]
          });
          if (this.props.privileged === "student") {
            this.studentInput.value = files[0].name;
          } else {
            this.mentorInput.value = files[0].name;
          }
        }
      }
    }
  };
  cancelUploadDocument = () => {
    this.setState({
      document: null
    });
  };
  handleSendDocument = priv => {
    const { document } = this.state;
    this.setState({ progress: true });
    S3FileUpload.uploadFile(document, documentConfig)
      .then(data => {
        if (priv === "student") {
          this.props.sendChat(data.location, "file", document.name);
          this.studentInput.value = "";
        } else {
          this.props.sendChatM(data.location, "file", document.name);
          this.mentorInput.value = "";
        }
      })
      .then(() => {
        this.setState({ progress: false });
        this.setState({ document: null });
      });
    this.documentInput.value = "";
  };
  verifyDocument = files => {
    if (files && files.length > 0) {
      const regex = /^application\/vnd/;
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;

      const result = regex.test(currentFileType);
      if (currentFileSize > imageMaxSize) {
        toast.error(
          "This file is not allowed. " +
            currentFileSize +
            " bytes is too large",
          {
            hideProgressBar: true,
            draggable: false
          }
        );
        return false;
      }
      if (!result && !acceptedDocumentsArray.includes(currentFileType)) {
        toast.error("This file type is not allowed", {
          hideProgressBar: true,
          draggable: false
        });
        return false;
      }
      return true;
    }
  };
  openGallery = index => {
    const images = this.props.conversation.filter(convo => {
      return (
        convo.chat_type === "image" &&
        ((this.props.senderInfo.sub === convo.sender_id &&
          this.props.chatmateInfo.sub === convo.chatmate_id) ||
          (this.props.senderInfo.sub === convo.chatmate_id &&
            this.props.chatmateInfo.sub === convo.sender_id))
      );
    });
    const selected = images.findIndex(image => image.id === index);
    this.setState({
      openGallery: true,
      selected,
      imgArray: images
    });
  };
  closeGallery = () => {
    this.setState({
      openGallery: false,
      selected: null
    });
  };
  handleChatMenu = (event, id) => {
    this.setState({ chatMenu: event.currentTarget, messageId: id });
  };

  handleCloseChatMenu = () => {
    this.setState({ chatMenu: null, messageId: null });
  };

  //ANCHOR render
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ToastContainer
          enableMultiContainer
          position={toast.POSITION.TOP_RIGHT}
        />
        <Paper elevation={1} className={classes.rightTopNav} square={true}>
          <Typography variant="subtitle1" className={classes.chatName}>
            {this.props.chatmateInfo.first_name}{" "}
            {this.props.chatmateInfo.last_name}
            <div className={classes.status}>
              <span className={`${classes.ab} ${classes.cd} ${classes.ef}`} />
              <Typography variant="caption" display="block">
                Active Now
              </Typography>
            </div>
          </Typography>
          <Box>
            <IconButton className={classes.settings} onClick={this.handleClick}>
              <MoreSettings />
            </IconButton>
            <StyledMenu
              id="customized-menu"
              anchorEl={this.state.openMenu}
              keepMounted
              open={Boolean(this.state.openMenu)}
              onClose={this.handleClose}
            >
              {this.state.assist.sub !== this.props.chatmateInfo.sub ? (
                <StyledMenuItem onClick={this.props.viewChatBox}>
                  <ListItemIcon>
                    <Close />
                  </ListItemIcon>
                  <ListItemText primary="Close Chat Box" />
                </StyledMenuItem>
              ) : null}

              {this.props.privileged === "mentor" &&
              this.state.assist.sub === this.props.chatmateInfo.sub ? (
                <Box>
                  <StyledMenuItem
                    onClick={() => {
                      this.removeFromQueue(this.state.assist);
                      this.props.viewChatBox();
                    }}
                  >
                    <ListItemIcon>
                      <BackToQueue />
                    </ListItemIcon>
                    <ListItemText primary="Move Back to Queue" />
                  </StyledMenuItem>

                  <StyledMenuItem onClick={this.openConfirmationDialog}>
                    <ListItemIcon>
                      <Done />
                    </ListItemIcon>
                    <ListItemText primary="Done" />
                  </StyledMenuItem>
                </Box>
              ) : null}
            </StyledMenu>
          </Box>
        </Paper>
        {this.state.progress ? <Progress style={{ height: 7 }} /> : null}

        <Paper
          elevation={0}
          classes={{ root: classes.mentorStyle1 }}
          className={
            this.props.privileged === "mentor"
              ? classes.mentorStyle
              : classes.rightNav
          }
          square={true}
        >
          <Grid
            container
            className={`${classes.chatBoxBody} ${classes.scrollBar}`}
            style={
              this.props.privileged === "mentor"
                ? { minHeight: "570px", maxHeight: "570px" }
                : { minHeight: "561px", maxHeight: "561px" }
            }
          >
            {this.props.privileged === "mentor" &&
            this.state.assist.sub === this.props.chatmateInfo.sub ? (
              <Paper className={classes.helpStatus}>
                <Typography variant="subtitle2" style={{ maxHeight: "57px" }}>
                  Student Concern: {this.props.helpingStudent.reason}
                </Typography>
              </Paper>
            ) : null}

            <div
              className={`${classes.chatBoxBody} ${classes.scrollBar}`}
              style={
                this.props.privileged === "mentor"
                  ? { minHeight: "517px" }
                  : { minHeight: "520px", maxHeight: "520px" }
              }
            >
              <Grid
                id="scrollDiv"
                item
                className={`${classes.chatContentWrapper} ${classes.scrollBar}`}
                style={
                  this.props.privileged === "mentor" &&
                  this.state.assist.sub === this.props.chatmateInfo.sub
                    ? { minHeight: "460px" }
                    : { minHeight: "488px", maxHeight: "443px" }
                }
              >
                {this.props.conversation.map((convo, i) =>
                  (this.props.senderInfo.sub === convo.sender_id &&
                    this.props.chatmateInfo.sub === convo.chatmate_id) ||
                  (this.props.senderInfo.sub === convo.chatmate_id &&
                    this.props.chatmateInfo.sub === convo.sender_id) ? (
                    <React.Fragment key={i}>
                      {parseInt(this.props.cohort_id) ===
                      parseInt(convo.cohort_id) ? (
                        <Box
                          id={convo.id}
                          className={
                            this.props.senderInfo.sub === convo.chatmate_id
                              ? classes.chatContent
                              : classes.chatContent2
                          }
                        >
                          {this.props.senderInfo.sub === convo.chatmate_id ? (
                            <Avatar
                              src={this.props.chatmateInfo.avatar}
                              className={classes.chatAvatar}
                            />
                          ) : null}

                          {this.props.senderInfo.sub ===
                          convo.chatmate_id ? null : (
                            <MoreHorizIcon
                              style={{ marginRight: 5 }}
                              className={classes.chatHover}
                              onClick={(e)=>{
                                this.handleChatMenu(e,convo.id);

                              }
                              }
                            />
                          )}

                          <Box
                            className={
                              convo.chat_type === "image" ||
                              convo.chat_type === "gif"
                                ? classes.chatImage
                                : convo.chat_type === "code"
                                ? classes.snippet
                                : this.props.senderInfo.sub ===
                                  convo.chatmate_id
                                ? classes.chatDetails
                                : classes.chatDetails2
                            }
                          >
                            <div className={classes.chatText}>
                              <Typography
                                variant="subtitle1"
                                className={classes.chatText}
                              >
                                {convo.chat_type === "text" ? (
                                  <TextareaAutosize
                                    readOnly
                                    className={classes.textAreaChat}
                                    style={{
                                      color:
                                        this.props.senderInfo.sub ===
                                        convo.chatmate_id
                                          ? "#263238"
                                          : "white"
                                    }}
                                    value={convo.message.replace(/\n$/, "")}
                                  />
                                ) : convo.chat_type === "file" ? (
                                  <Box
                                    component="div"
                                    my={2}
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                  >
                                    <Link
                                      style={{ fontWeight: "bold" }}
                                      href={convo.link}
                                      color="inherit"
                                      variant="body2"
                                    >
                                      {convo.message}
                                    </Link>
                                  </Box>
                                ) : convo.chat_type === "image" ? (
                                  <img
                                    style={{ width: "100%", cursor: "pointer" }}
                                    src={convo.link}
                                    alt=""
                                    onClick={() => this.openGallery(convo.id)}
                                  />
                                ) : convo.chat_type === "gif" ? (
                                  <img
                                    style={{ width: "100%" }}
                                    src={convo.link}
                                    alt=""
                                  />
                                ) : (
                                  <AceEditor
                                    highlightActiveLine={false}
                                    wrapEnabled
                                    maxLines={25}
                                    fontSize="16px"
                                    width="35vw"
                                    mode={convo.link}
                                    value={convo.message}
                                    theme={
                                      this.props.senderInfo.sub !==
                                      convo.chatmate_id
                                        ? "dracula"
                                        : "github"
                                    }
                                    readOnly
                                  />
                                )}
                              </Typography>
                            </div>
                            <div className={classes.chatTime}>
                              <Typography
                                variant="caption"
                                className={
                                  convo.chat_type === "code"
                                    ? classes.snippetTime
                                    : classes.time
                                }
                              >
                                {convo.time}
                              </Typography>

                              {/* {this.props.senderInfo.sub === convo.sender_id ? (
                                <button
                                  onClick={() =>
                                    this.props.deleteMessage(convo.id)
                                  }
                                >
                                  delete chat
                                </button>
                              ) : null} */}
                            </div>
                          </Box>
                          {/* {this.props.senderInfo.sub === convo.chatmate_id ? (
                              <MoreHorizIcon
                                className={classes.chatHover}
                                onClick={this.handleChatMenu}
                              />
                            ) : null} */}

                        </Box>
                      ) : null}
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={i} />
                  )
                )}
                {this.props.chatM.length > 0 &&
                this.props.privileged === "student" ? (
                  <TypingEffect />
                ) : this.props.chat.length > 0 &&
                  this.props.privileged === "mentor" ? (
                  <TypingEffect />
                ) : null}

                <input
                  type="text"
                  readOnly
                  style={{
                    height: 1,
                    border: "none",
                    outline: "none"
                  }}
                  id="focus"
                  ref={this.messagesEndRef}
                />
              </Grid>
            </div>
          </Grid>

          {this.props.privileged === "student" ? (
            <React.Fragment>
              <Box xs={12} sm={8}>
                <div className={classes.footerInput}>
                  <input
                    type="file"
                    onChange={this.handleDocumentUpload}
                    style={{ display: "none" }}
                    ref={documentInput => (this.documentInput = documentInput)}
                  />
                  <IconButton
                    style={{ margin: "0px -8px 0px 5px" }}
                    onClick={() => this.documentInput.click()}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <input
                    type="file"
                    onChange={this.handleUpload}
                    style={{ display: "none" }}
                    ref={fileInput => (this.fileInput = fileInput)}
                  />
                  <IconButton onClick={this.handleImageMenu}>
                    <Photo />
                  </IconButton>
                  <ImageMenu
                    openSplash={this.handleSplash}
                    fileRef={this.fileInput}
                    open={this.state.imageMenu}
                    handleClose={this.handleImageMenuClose}
                  />
                  {/* ANCHOR STUDENT TEXTFIELD */}
                  <React.Fragment>
                    <TextField
                      autoFocus
                      inputRef={studentInput =>
                        (this.studentInput = studentInput)
                      }
                      classes={{ root: "MenuItem" }}
                      placeholder="Send message"
                      className={classes.textField}
                      multiline={true}
                      rowsMax="4"
                      margin="normal"
                      fullWidth
                      variant="outlined"
                      onKeyUp={e => {
                        if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
                          this.openSnippet();
                        } else if (
                          e.target.value
                            .replace(/^\s+/, "")
                            .replace(/\s+$/, "") !== ""
                        ) {
                          if (e.key === "Enter" && !e.shiftKey) {
                            this.state.image
                              ? this.handleSendImage("student")
                              : this.state.document
                              ? this.handleSendDocument("student")
                              : this.props.sendChat(
                                  null,
                                  null,
                                  this.studentInput.value
                                );

                            this.openPicker();
                            this.studentInput.value = "";
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={this.openPicker}>
                              <InsertEmoticon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        classes: { root: classes.custom }
                      }}
                    />
                    {this.state.image || this.state.document ? (
                      <IconButton
                        className={classes.sendIcon}
                        onClick={() => {
                          this.state.image
                            ? this.handleSendImage("student")
                            : this.handleSendDocument("student");
                          this.openPicker();
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    ) : null}
                  </React.Fragment>
                </div>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box xs={12} sm={8}>
                <div className={classes.footerInput}>
                  <input
                    type="file"
                    onChange={this.handleDocumentUpload}
                    style={{ display: "none" }}
                    ref={documentInput => (this.documentInput = documentInput)}
                  />
                  <IconButton
                    style={{ margin: "0px -8px 0px 5px" }}
                    onClick={() => this.documentInput.click()}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <input
                    type="file"
                    onChange={this.handleUpload}
                    style={{ display: "none" }}
                    ref={fileInput => (this.fileInput = fileInput)}
                  />
                  <IconButton onClick={this.handleImageMenu}>
                    <Photo />
                  </IconButton>
                  <ImageMenu
                    openSplash={this.handleSplash}
                    fileRef={this.fileInput}
                    open={this.state.imageMenu}
                    handleClose={this.handleImageMenuClose}
                  />
                  <TextField
                    autoFocus
                    inputRef={mentorInput => (this.mentorInput = mentorInput)}
                    classes={{ root: "MenuItem" }}
                    placeholder="Send message"
                    className={classes.textField}
                    multiline={true}
                    rowsMax="4"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    onKeyUp={e => {
                      if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
                        this.openSnippet();
                      } else if (
                        e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s+$/, "") !== ""
                      ) {
                        if (e.key === "Enter" && !e.shiftKey) {
                          this.state.image
                            ? this.handleSendImage("mentor")
                            : this.state.document
                            ? this.handleSendDocument("mentor")
                            : this.props.sendChatM(
                                null,
                                null,
                                this.mentorInput.value
                              );
                          this.openPicker();
                          this.mentorInput.value = "";
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={this.openPicker}>
                            <InsertEmoticon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      classes: { root: classes.custom }
                    }}
                  />
                  {this.state.image || this.state.document ? (
                    <IconButton
                      className={classes.sendIcon}
                      onClick={() => {
                        this.state.image
                          ? this.handleSendImage("mentor")
                          : this.handleSendDocument("mentor");
                        this.openPicker();
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  ) : null}
                </div>
              </Box>
            </React.Fragment>
          )}
          <Dialog
            fullWidth
            open={this.state.confirmationDialog}
            aria-labelledby="alert-dialog-title"
          >
            <ConfirmationDialog
              cancel={this.closeConfirmationDialog}
              doneHelp={this.doneHelp}
              helpingStudent={this.state.assist}
            />
          </Dialog>

          <Splash
            uploadGif={this.uploadGif}
            open={this.state.splashDialog}
            handleClose={this.closeSplash}
          />
          <Emoji
            openPicker={this.openPicker}
            anchorEl={this.state.emoji}
            handleEmoji={this.handleEmoji}
          />

          <Gallery
            conversation={this.state.imgArray}
            open={this.state.openGallery}
            handleClose={this.closeGallery}
            selected={this.state.selected}
          />
          <Snippet
            open={this.state.openSnippet}
            handleClose={this.openSnippet}
            sendChat={this.props.sendCode}
            type="pm"
          />
           <Menu
            id="simple-menu"
            anchorEl={this.state.chatMenu}
            keepMounted
            open={Boolean(this.state.chatMenu)}
            onClose={this.handleCloseChatMenu}
            style={{ height: 500, width: 150, marginTop: 10, marginLeft: 4 }}
          >
            {/* <MenuItem onClick={this.handleCloseChatMenu} dense>
              Edit
            </MenuItem> */}
            <MenuItem onClick={() => {
              this.handleCloseChatMenu();
              this.props.deleteMessage(this.state.messageId)
            }} dense>
              Delete
            </MenuItem>
          </Menu>

        </Paper>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(ChatBox);
