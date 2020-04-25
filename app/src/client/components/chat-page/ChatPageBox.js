import React, { Component } from "react";
import { withStyles, lighten } from "@material-ui/core/styles";
import styles from "./ChatPageStyle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TypingEffect from "../chat-box/typingEffect";
import LinearProgress from '@material-ui/core/LinearProgress';
import Photo from '@material-ui/icons/Photo'
import { InputAdornment } from '@material-ui/core'
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import GroupIcon from '@material-ui/icons/Group';
import Snippet from './snippet/snippet';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditGroup from "./dialogs/EditGroup";
import api from "../../services/fetchApi";
import Link from "@material-ui/core/Link";
import ImageMenu from "../chat-box/imageMenu";
import Splash from "../chat-box/plugins/giphy";
import Emoji from '../chat-box/plugins/emoji';
import Gallery from './gallery/galleryDialog';
import AceEditor from 'react-ace';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/dracula'
import io from "socket.io-client";
import S3FileUpload from 'react-s3'
import { ToastContainer, toast } from "react-toastify";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const imageConfig = {
  bucketName: 'boomcamp',
  dirName: 'handraiser/image-uploads/chat-images',
  region: 'us-west-2',
  accessKeyId: 'AKIAQQHQFF5EPNACIXE3',
  secretAccessKey: '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',
}
const documentConfig = {
  bucketName: 'boomcamp',
  dirName: 'handraiser/file-uploads',
  region: 'us-west-2',
  accessKeyId: 'AKIAQQHQFF5EPNACIXE3',
  secretAccessKey: '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',
}

const socket = io("http://boom-handraiser.com:3001/");
const imageMaxSize = 30000000;
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

class ChatPageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null,
      image: null,
      progress: false ,
      assist: [],
      imageMenu: null,
      splashDialog: false,
      emoji: false,
      document: null,
      openGallery: false,
      selected: null,
      imgArray: [],
      openSnippet: false,
      anchorEl: null,
      openEditGroup: false,
      //group
      groupId: null,
      userNotInGroup: [],
      groupName: "",
      gc: false,
      checkInGroup: false,
      chatmate: false,
      chatMateSub: this.props.chatmateInfo.sub,
      pmConvo: '',
      chatMenu: null,
      messageId: null,
    };
  }
  openSnippet = () => {
    this.setState({ openSnippet: !this.state.openSnippet })
  }
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
          this.textInput.value = files[0].name
        }
      }
    }
  };
  handleSendImage = type => {
    const { image } = this.state;
    this.setState({ progress: true })
    const imageName = this.makeid(image.name);
    S3FileUpload
    .uploadFile(image, imageConfig)
    .then(data => {
      if (type === 'group'){
        this.props.sendChatGroup(data.location, "image", imageName);
      }
      else {
        this.props.sendChat(data.location, imageName, "image");
      }
    })    
    .then(()=>{
      this.setState({ progress: false });
      this.setState({ image: null});
    })
    .catch((err) =>{
      console.log(err)
    })
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
    if (this.props.chatmateInfo.sub === undefined){
      this.props.sendChatGroup(gif.images.downsized.url, "gif", " ");
    }
    else {
      this.props.sendChat(gif.images.downsized.url, " ", "gif");
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
    this.textInput.value = this.textInput.value + emoji.native;
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
          this.textInput.value = files[0].name
        }
      }
    }
  };
  cancelUploadDocument = () => {
    this.setState({
      document: null
    });
  };
  //ANCHOR HANDLE DOCUMENT
  handleSendDocument = type => {
    const { document } = this.state;
    this.setState({ progress: true })
    S3FileUpload
    .uploadFile(document, documentConfig)
    .then(data => {
      if (type === 'group'){
        this.props.sendChatGroup(data.location, "file", document.name);
      }
      else {
        this.props.sendChat(data.location, document.name, "file");
      }
    })
    .then(()=>{
      this.setState({ progress: false });
      this.setState({ document: null});
    })
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
  //FILE UPLOAD END
  //gallery
  openGallery = index => {
    let images;
    if (this.props.chatmateInfo.sub === undefined){
      images = this.props.groupConversation.filter(convo => {
        return (
          convo.chat_type === "image" && 
          this.props.chatmateInfo.id === convo.groupchat_id
        );
      });
    }
    else {
      images = this.props.conversation.filter(convo => {
        return (
          convo.chat_type === "image" &&
          ((convo.sender_id === this.props.userInfo.sub &&
            this.props.chatmateInfo.sub === convo.chatmate_id) ||
            (convo.chatmate_id === this.props.userInfo.sub &&
              this.props.chatmateInfo.sub === convo.sender_id))
        );
      });
    }  
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
  //gallery end

  //Menu
  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };
  //

  handleClickEditGroup = groupId => {
    api
      .fetch(`http://localhost:3001/api/getAllUserNotInGroup/${groupId}`, "get")
      .then(data => {
        this.setState({ userNotInGroup: [...data.data] });
      });
    this.setState({ openEditGroup: true, anchorEl: null });
  };
  handleCloseEditGroup = () => this.setState({ openEditGroup: false });
  handleChatMenu = (event, id) => {
    this.setState({ chatMenu: event.currentTarget, messageId: id });
  };

  handleCloseChatMenu = () => {
    this.setState({ chatMenu: null, messageId: null });
  };

  //leave group  / delete member
  leaveGroup = (groupId, sub) => {
    // console.log(groupId,sub)
    this.setState({ gc: true })
    api.fetch(`/api/leaveGroup/${sub}/${groupId}`, "delete")
      .then(data => {
        document.location.reload(true)
        socket.emit("chatGroupList", data.data);
        socket.emit("refreshGroupName", [this.props.userInfo.sub, this.state.groupId]);
      })
  }

  render() {
    const { classes } = this.props;
    let gcConver;
    if (this.state.gc === false) {
      this.props.groupListInfo.forEach(gc => {
        if (gc.id === this.props.chatmateInfo.id) {
          this.setState({ gc: true });
        }
      });
    }
    setTimeout(() => {
        this.setState({chatmate:true})
    }, 3000)
    if (this.props.groupConversation.length >= 8){
      gcConver = [...this.props.groupConversation].slice((this.props.groupConversation.length - 1) - this.props.groupShow, this.props.groupConversation.length)
    }
    else {
      gcConver = this.props.groupConversation
    }
    return (
      <Grid item md={6} xs={8} style={{ minHeight: "800px" }}>
        <ToastContainer
          enableMultiContainer
          position={toast.POSITION.TOP_RIGHT}
        />
        <Paper
          style={{
            height: "800px",
            maxHeight: "800px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ height: "92%" }}>
            {/* Chatbox Header */}
            <div>
              <div className={classes.chatBoxHeader}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  {this.props.chatmateInfo.avatar === undefined ? (
                    <Avatar style={{ marginRight: 10 }}>
                      {" "}
                      <GroupIcon />{" "}
                    </Avatar>
                  ) : (
                      <Avatar
                        style={{ marginRight: 10 }}
                        src={this.props.chatmateInfo.avatar}
                      />
                    )}

                  <div>
                    <Typography variant="body">
                      {this.props.chatmateInfo.first_name === undefined
                        ? this.props.chatmateInfo.name
                        : `${this.props.chatmateInfo.first_name} ${this.props.chatmateInfo.last_name}`}
                    </Typography>
                    {this.props.chatmateInfo.status === "active" ? (
                      <div className={classes.activeNowWrapper}>
                        <div className={classes.activeNowCircle} />
                        <Typography
                          variant="subtitle2"
                          style={{ marginTop: 2 }}
                        >
                          Active Now
                        </Typography>
                      </div>
                    ) : null}
                  </div>
                </span>

                {this.props.chatmateInfo.first_name === undefined ? (
                  <IconButton
                    onClick={this.handleMenuClick}
                    disabled={
                      !this.state.gc &&
                        this.props.chatmateInfo.sub === undefined
                        ? true
                        : false
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                ) : (
                    ""
                  )}

                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
                  style={{ marginTop: 55 }}
                >
                  <MenuItem
                    onClick={() => {
                      this.handleClickEditGroup(this.props.chatmateInfo.id);
                      this.setState({
                        groupId: this.props.chatmateInfo.id,
                        groupName: this.props.chatmateInfo.name
                      });
                    }}
                  >

                    Edit Group
                  </MenuItem>
                  {this.props.chatmateInfo.user_sub !==
                    this.props.userInfo.sub ? (
                      <MenuItem
                        onClick={() => {
                          this.handleMenuClose();
                          this.leaveGroup(
                            this.props.chatmateInfo.id,
                            this.props.userInfo.sub
                          );
                        }}
                      >
                        Leave Group
                    </MenuItem>
                    ) : null}
                </Menu>
              </div>
              <Divider />
            </div>
            {/* End Chatbox Header */}
            {this.state.progress
              ? <Progress
                style={{ height: 7 }}
              />
              : null
            }

            {/* Main Chatbox */}
            <div
              id="scrollDiv"
              style={{ height: "88%", overflowY: "auto" }}
              className={classes.scrollBar}
            >
              <div className={classes.chatBoxContainer}>
                {(this.props.chatmateInfo.sub === undefined && this.props.groupConversation.length >= 8) && (this.props.groupConversation.length - 1 !== this.props.groupShow )
               ? <div id="seeMore" style={{display:'flex', justifyContent:'center', cursor:'pointer'}} onClick={this.props.showMoreGroup}>
                  <Typography variant="overline">
                  Show more
                  </Typography>
                </div>
                : null
                }
                {this.props.chatmateInfo.sub !== undefined ? (
                  this.props.conversation.map((convo, i) =>
                  (convo.sender_id === this.props.userInfo.sub &&
                      this.props.chatmateInfo.sub === convo.chatmate_id) ||
                    (convo.chatmate_id === this.props.userInfo.sub &&
                      this.props.chatmateInfo.sub === convo.sender_id) ? (
                        //ANCHOR PM CHAT BOX
                        <React.Fragment key={i}>
                        {convo.cohort_id === "all" ? (
                          <div className={convo.sender_id !== this.props.userInfo.sub?classes.senderChatWrapper:classes.receiverChatWrapper}>
  
                            {convo.sender_id !== this.props.userInfo.sub?
                            <Avatar style={{ marginRight: "10px" }} src={this.props.chatmateInfo.avatar}/>
                            :null
                            }

                          {convo.sender_id !== this.props.userInfo.sub? null : (
                            <MoreHorizIcon
                              style={{ marginRight: 5 }}
                              className={classes.chatHover}
                              onClick={(e)=> this.handleChatMenu(e, [convo.id, "pm"])}
                            />
                          )}
                                <Box 
                                className={
                                    (convo.chat_type === "image" || 
                                      convo.chat_type === 'gif')
                                    ? classes.chatImage
                                    : (convo.chat_type === 'code')
                                      ? classes.snippet
                                      : (convo.sender_id !== this.props.userInfo.sub)
                                      ? classes.senderBox
                                      : classes.receiverBox
                                }>
                                {convo.chat_type === "text"
                                  ? <TextareaAutosize
                                    readOnly
                                    className={classes.textAreaChat}
                                    style={convo.sender_id !== this.props.userInfo.sub?{ color: "#263238" }:{ color: "#fff" }}
                                    value={convo.message.replace(/\n$/, "")}
                                    />
                                  : (convo.chat_type === "file")
                                    ? <Box
                                      component="div"
                                      my={2}
                                      textOverflow="ellipsis"
                                      overflow="hidden"
                                      >
                                       <Link style={{ fontWeight: 'bold' }}href={convo.link} color="inherit" variant="body2">{convo.message}</Link>
                                      </Box>
                                    :  (convo.chat_type === "image")
                                        ? <img style={{ width: "100%", cursor: 'pointer' }} src={convo.link} alt="" onClick={() => this.openGallery(convo.id)} />
                                        : (convo.chat_type === "gif")
                                          ? <img style={{ width: "100%"}} src={convo.link} alt=""/>
                                          : <AceEditor
                                          wrapEnabled
                                          maxLines={100}
                                          fontSize="16px"
                                          width="35vw"
                                          mode="javascript"
                                          value={convo.message}
                                          theme={convo.sender_id === this.props.userInfo.sub ? "dracula" : "github"}
                                          readOnly
                                          />
                                }
                                  <Typography variant="caption" className={convo.chat_type === "code" ? classes.snippetTime : classes.time}>
                                    {convo.time}
                                  </Typography>
                                </Box>




                                {/* {this.props.userInfo.sub === convo.sender_id?
                                <button onClick={()=>this.props.deleteMessage(convo.id)}>delete message</button>
                                :
                                null
                                } */}
                                






                              </div>
                        ):
                        null}
                    </React.Fragment>
                    ) : null
                  )
                ) : this.state.gc ? (
                    gcConver.map((gcConvo, i) =>
                    this.props.chatmateInfo.id === gcConvo.groupchat_id ? (
                      //ANCHOR GC CHATBOX
                      <React.Fragment key={i}>
                        <div
                          className={
                            gcConvo.sender_sub !== this.props.userInfo.sub
                              ? classes.senderChatWrapper
                              : classes.receiverChatWrapper
                          }
                        >
                          {gcConvo.sender_sub !== this.props.userInfo.sub ? (
                            <Avatar
                              style={{ marginRight: "10px" }}
                              src={gcConvo.avatar}
                            />
                          ) : null}

                          {gcConvo.sender_sub !== this.props.userInfo.sub? null : (
                            <MoreHorizIcon
                              style={{ marginRight: 5 }}
                              className={classes.chatHover}
                              onClick={(e)=> this.handleChatMenu(e, [gcConvo.id, "gc"])}
                            />
                          )}

                            <Box 
                                className={
                                    (gcConvo.chat_type === "image" || 
                                    gcConvo.chat_type === 'gif')
                                    ? classes.chatImage
                                    : (gcConvo.chat_type === 'code')
                                      ? classes.snippet
                                      : (gcConvo.sender_sub !== this.props.userInfo.sub)
                                      ? classes.senderBox
                                      : classes.receiverBox
                            }>
                            {gcConvo.chat_type === "text"
                            ? <TextareaAutosize
                                readOnly
                                className={classes.textAreaChat}
                                style={
                                  gcConvo.sender_sub !== this.props.userInfo.sub
                                    ? { color: "#263238" }
                                    : { color: "#fff" }
                                }
                                value={gcConvo.message.replace(/\n$/, "")}
                              />
                            : (gcConvo.chat_type === "file")
                              ? <Box
                                component="div"
                                my={2}
                                textOverflow="ellipsis"
                                overflow="hidden"
                                >
                                  <Link style={{ fontWeight: 'bold' }} href={gcConvo.link} color="inherit" variant="body2">{gcConvo.message}</Link>
                                </Box>
                              :  (gcConvo.chat_type === "image")
                                ? <img style={{ width: "100%", cursor: 'pointer' }} src={gcConvo.link} alt="" onClick={() => this.openGallery(gcConvo.id)} />
                                : (gcConvo.chat_type === "gif")
                                  ? <img style={{ width: "100%"}} src={gcConvo.link} alt=""/>
                                  : <AceEditor
                                      wrapEnabled
                                      maxLines={100}
                                      fontSize="16px"
                                      width="35vw"
                                      mode="javascript"
                                      value={gcConvo.message}
                                      theme={gcConvo.sender_sub === this.props.userInfo.sub ? "dracula" : "github"}
                                      readOnly
                                    />
                            }
                            <Typography variant="caption" className={gcConvo.chat_type === "code" ? classes.snippetTime : classes.time}>
                              {gcConvo.time}
                            </Typography>
                          </Box>
                         
                        </div>
                        
                      </React.Fragment>
                    ) : null
                  )
                ) : !this.state.gc &&
                this.props.chatmateInfo.name !== undefined ? (
                //START OF EDIT HERE EARL
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      background: "red",
                      color: "white",
                      padding: 3,
                      borderRadius: 10
                    }}
                  >
                    <WarningIcon
                      style={{ marginRight: 10, marginTop: 1.5 }}
                    />
                    <Typography variant="overline">
                      You're not a member of this group
                    </Typography>
                  </div>
                </React.Fragment>
                ) : 
                //GAWING LOADER
                !this.state.chatmate?

                <React.Fragment>
                  <div className={classes.messageLoader}>
                    <CircularProgress />
                    <Typography variant="overline" style={{ marginTop: 10 }}>
                      Loading Messages
                    </Typography>
                  </div>
                </React.Fragment>
                :

                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      background: "#fea000",
                      color: "white",
                      padding: 3,
                      borderRadius: 10
                    }}
                  >
                    <Typography variant="overline">
                      No private messages found!
                    </Typography>
                  </div>
                </React.Fragment>

                }

                {this.props.chatmateText.length > 0 &&
                  this.props.chatmateInfo.name === undefined ? (
                    <TypingEffect />
                  ) : null}
                {this.props.chatmateText.length > 0 &&
                  this.props.chatmateInfo.sub === undefined &&
                  this.state.gc === true ? (
                    <TypingEffect />
                  ) : null}

                <input type="text"
                  readOnly style={{
                  height: 1,
                  border: 'none',
                  outline: 'none' }} 
                  id="focus" 
                  ref={this.messagesEndRef} 
                />
              </div>
            </div>
            {/* End Chatbox */}
          </div>
          {/* Message Box */}
          <div style={{ height: "auto" }}>
            <Divider />
            <div className={classes.messageWrapper}>
              <input
                type="file"
                onChange={this.handleDocumentUpload}
                style={{ display: "none" }}
                ref={documentInput => (this.documentInput = documentInput)}
              />
              <IconButton
                style={{ marginRight: 4 }}
                onClick={() => this.documentInput.click()}
                disabled={
                  !this.state.gc && this.props.chatmateInfo.sub === undefined
                    ? true
                    : false
                }
              >
                <AttachFileIcon />
              </IconButton>
              <input
                type="file"
                onChange={this.handleUpload}
                style={{ display: "none" }}
                ref={fileInput => (this.fileInput = fileInput)}
              />
              <IconButton
                style={{ marginRight: 10 }}
                onClick={this.handleImageMenu}
                disabled={
                  !this.state.gc && this.props.chatmateInfo.sub === undefined
                    ? true
                    : false
                }
              >
                <Photo />
              </IconButton>
              <ImageMenu
                openSplash={this.handleSplash}
                fileRef={this.fileInput}
                open={this.state.imageMenu}
                handleClose={this.handleImageMenuClose}
              />
              <TextField
                id="text"
                inputRef={textInput => (this.textInput = textInput)}
                variant="outlined"
                multiline
                rowsMax="4"
                fullWidth
                placeholder="Send Message"
                color="primary"
                style={{ marginRight: 5 }}
                onKeyUp={e => {
                  if (e.ctrlKey && e.shiftKey && e.key === "Enter"){
                    this.openSnippet()
                  }
                  else if (
                    e.target.value.replace(/^\s+/, "").replace(/\s+$/, "") !==
                    ""
                  ) {
                    if (e.key === "Enter" && !e.shiftKey) {
                      if (
                        this.state.image &&
                        this.props.chatmateInfo.sub !== undefined
                      ) {
                        this.handleSendImage("student");
                      } else if (
                        !this.state.image &&
                        this.props.chatmateInfo.sub !== undefined
                      ) {
                        this.props.sendChat(null, this.textInput.value, null);
                        this.openPicker();
                      } else if (this.props.chatmateInfo.sub === undefined) {
                        this.props.sendChatGroup(null, null, this.textInput.value);
                        this.openPicker();
                      }
                      this.textInput.value = ""
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={this.openPicker}
                        disabled={
                          !this.state.gc &&
                            this.props.chatmateInfo.sub === undefined
                            ? true
                            : false
                        }
                      >
                        <InsertEmoticon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                disabled={
                  !this.state.gc && this.props.chatmateInfo.sub === undefined
                    ? true
                    : false
                }
              />
              {this.state.image || this.state.document
              ? <IconButton
                onClick={() => {
                  if (this.props.chatmateInfo.sub === undefined) {
                    
                    if (this.state.image) {
                      this.handleSendImage('group');
                    } else {
                      this.handleSendDocument('group');
                    }
                    this.openPicker();
                    this.textInput.value = ""
                  }
                  else {
                    if (this.state.image) {
                      this.handleSendImage();
                    } else {
                      this.handleSendDocument();
                    }
                    this.openPicker();
                    this.textInput.value = ""
                  } 
                }}
              >
                <SendIcon />
              </IconButton>
            : null
            }
            </div>
          </div>
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
            sendGroup={this.props.sendCodeGroup}
            type={this.props.chatmateInfo.sub ? "pm" : "gc"}
          />
          
          <EditGroup
            openDialog={this.state.openEditGroup}
            handleClose={this.handleCloseEditGroup}
            avatarSample={this.props.userInfo.avatar}
            groupId={this.state.groupId}
            users={this.state.userNotInGroup}
            groupName={this.state.groupName}
            refreshComponent={this.props.refreshComponent}
            sub={this.props.userInfo.sub}
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
      </Grid>
    );
  }
}

export default withStyles(styles)(ChatPageBox);
