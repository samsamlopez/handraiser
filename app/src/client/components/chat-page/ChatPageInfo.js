import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./ChatPageStyle";
//MAIN
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

//CHATLIST
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GroupIcon from "@material-ui/icons/Group";
import Gallery from "./gallery/galleryDialog";
//expansion
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Link from "@material-ui/core/Link";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import Photo from "@material-ui/icons/Photo";
//List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import ConfirmDelete from "./dialogs/confirmDelete"

import api from "../../services/fetchApi";
import io from "socket.io-client";
const socket = io("http://boom-handraiser.com:3001/");


const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ImageExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: "8px 0px 0px"
  }
}))(MuiExpansionPanelDetails);

class ChatPageInfo extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      selected: null,
      imgArray: [],
      expanded: "photos",
      dialogConfirmDel: false,
      delUser: []
    };
  }
  componentDidMount(){

  }

  openGallery = index => {
    let images
    if (this.props.chatmateInfo.sub) {
      images = this.props.conversation.filter(convo => {
        return convo.chat_type === 'image' && ((convo.sender_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.chatmate_id) ||
          (convo.chatmate_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.sender_id))
      })
    }
    else {
      images = this.props.groupConversation.filter(convo => {
        return (
          convo.chat_type === "image" &&
          this.props.chatmateInfo.id === convo.groupchat_id
        );
      });
    }
    const selected = images.findIndex(image => image.id === index);
    this.setState({
      open: true,
      selected,
      imgArray: images
    });
  };

  closeGallery = () => {
    this.setState({
      open: false,
      selected: null
    });
  };

  handleExpland = panel => (event, isExpanded) => {
    this.setState(prev => ({
      expanded: isExpanded ? panel : false
    }));
  };

  deleteMember = (sub,groupId) =>{
    api.fetch(`/api/leaveGroup/${sub}/${groupId}`,"delete")
    .then(data=>{
      socket.emit("groupMembers", 'DELETED');
    })
  }

  openConfirmation = (user) =>{
    this.setState({
      dialogConfirmDel: true,
      delUser: user
    })
  }

  closeConfirmation = () =>{
    this.setState({
      dialogConfirmDel: false
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid item md={3} xs={12} style={{ height: "800px" }}>
          <Paper>
            <div className={classes.chatInfoHeader}>
              {this.props.chatmateInfo.avatar === undefined ? (
                <Avatar className={classes.avatarLarge}>
                  {" "}
                  <GroupIcon style={{ fontSize: "48px" }} />{" "}
                </Avatar>
              ) : (
                  <Avatar
                    className={classes.avatarLarge}
                    src={this.props.chatmateInfo.avatar}
                  ></Avatar>
                )}
              <Typography variant="h6">
                {this.props.chatmateInfo.first_name === undefined
                  ? this.props.chatmateInfo.name
                  : `${this.props.chatmateInfo.first_name} ${this.props.chatmateInfo.last_name}`}
              </Typography>
              <Typography variant="overline">
                {this.props.chatmateInfo.privilege}
              </Typography>
            </div>

            {/*PHOTOS PANEL */}
            <ExpansionPanel
              expanded={this.state.expanded === "photos"}
              onChange={this.handleExpland("photos")}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <span className={classes.photosTitle}>
                  <Photo style={{ marginRight: 10 }} />
                  <Typography variant="overline">SHARED PHOTOS</Typography>
                </span>
              </ExpansionPanelSummary>
              <ImageExpansionPanelDetails>
                <div
                  style={this.props.chatmateInfo.first_name === undefined ? { height: 395 } : {}}
                  className={`${classes.photosGridContainer} ${classes.scrollBar}`}
                >
                  <div className={classes.photosGrid}>
                    <GridList cellHeight={160} cols={3}>
                      {this.props.chatmateInfo.sub
                        ? this.props.conversation.map(convo => (
                          convo.chat_type === 'image' && ((convo.sender_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.chatmate_id) ||
                            (convo.chatmate_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.sender_id))
                            ? <GridListTile style={{ cursor: 'pointer' }} cols={1} onClick={() => this.openGallery(convo.id)}>
                              <img src={convo.link} alt=""/>
                            </GridListTile>
                            : null
                        ))
                        : this.props.groupConversation.map(convo => (
                          convo.chat_type === 'image' && this.props.chatmateInfo.id === convo.groupchat_id
                            ? <GridListTile style={{ cursor: 'pointer' }} cols={1} onClick={() => this.openGallery(convo.id)}>
                              <img src={convo.link} alt=""/>
                            </GridListTile>
                            : null
                        ))
                      }
                    </GridList>
                  </div>
                </div>
              </ImageExpansionPanelDetails>
            </ExpansionPanel>
            {/* END PHOTOS PANEL */}

            {/*FILES PANEL */}
            <ExpansionPanel
              expanded={this.state.expanded === "files"}
              onChange={this.handleExpland("files")}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <span className={classes.photosTitle}>
                  <InsertDriveFile style={{ marginRight: 10 }} />
                  <Typography variant="overline">shared files</Typography>
                </span>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div
                  style={this.props.chatmateInfo.first_name === undefined ? { height: 371 } : {}}
                  className={`${classes.filesGridContainer} ${classes.scrollBar}`}
                >
                  <div className={classes.photosGrid}>
                    <GridList cellHeight={25} cols={3}>
                      {this.props.chatmateInfo.sub
                        ? this.props.conversation.map(convo => (
                          convo.chat_type === 'file' && ((convo.sender_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.chatmate_id) ||
                            (convo.chatmate_id === this.props.userInfo.sub && this.props.chatmateInfo.sub === convo.sender_id))
                            ? <GridListTile cols={3}>
                              <Link href={convo.link} variant="body2">{convo.message}</Link>
                            </GridListTile>
                            : null
                        ))
                        : this.props.groupConversation.map(convo => (
                          convo.chat_type === 'file' && this.props.chatmateInfo.id === convo.groupchat_id
                            ? <GridListTile cols={3}>
                              <Link href={convo.link} variant="body2">{convo.message}</Link>
                            </GridListTile>
                            : null
                        ))
                      }
                    </GridList>
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {/*END FILES PANEL */}

            {/*MEMBERS PANEL */}
            {this.props.chatmateInfo.first_name === undefined ? (
              <ExpansionPanel
                expanded={this.state.expanded === "members"}
                onChange={this.handleExpland("members")}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <span className={classes.photosTitle}>
                    <GroupIcon style={{ marginRight: 10 }} />
                    <Typography variant="overline">Members</Typography>
                  </span>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List
                    style={{ width: "100%", overflowY: "auto", height: 365 }}
                    className={classes.scrollBar}
                  >
                    {this.props.groupMembers.map(value => {
                      return (
                        <React.Fragment>
                          <Divider />
                          <ListItem fullWidth key={value.id}>
                            <ListItemAvatar>
                              <Avatar src={value.avatar} />
                            </ListItemAvatar>
                            <ListItemText primary={`${value.first_name} ${value.last_name}`} />
                            <IconButton
                              onClick={()=>{
                                this.openConfirmation(value)
                                // this.deleteMember(value.sub, this.props.groupChatId)
                              }}
                            >
                              <DeleteIcon/>
                          </IconButton>
                        </ListItem>
                            <Divider />
                        </React.Fragment>
                          )
                        })}
    
    
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
                ) : (
                    null
                  )}
            {/*END MEMBERS PANEL */}
          </Paper>
        </Grid>
          {/*GALLERY */}
          {this.state.imgArray.length > 0 && (
            <Gallery
              conversation={this.state.imgArray}
              open={this.state.open}
              handleClose={this.closeGallery}
              selected={this.state.selected}
            />
          )}
          <ConfirmDelete
            open={this.state.dialogConfirmDel}
            close={this.closeConfirmation}
            groupId = {this.props.groupChatId}
            deleteMember = {this.deleteMember}
            user = {this.state.delUser}
          />
      </React.Fragment>
        );
      }
    }
    
    export default withStyles(styles)(ChatPageInfo);
