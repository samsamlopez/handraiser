const styles = theme => ({
  container: {
    marginTop: 93
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },

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

  // ChatPageList
  chatListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },

  avatarWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  chatListWrapper: {
    height: "613px",
    overflowY: "auto",
    overflowX: "hidden"
  },

  chatDetails: {
    display: "flex",
    justifyContent: "space-between",
    width: "90%",
    [theme.breakpoints.down("md")]: {
      width: "80%"
    }
  },

  chatPrev: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "86%",
    color: "#263238"
  },

  timeBadgeWrap: {
    display: "flex",
    flexDirection: "column",
    width: "20%",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "30%"
    }
  },

  smBP: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  //End ChatPageList

  // ChatPageBox
  chatBoxHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15
  },

  activeNowWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  activeNowCircle: {
    height: 10,
    width: 10,
    borderRadius: "50%",
    backgroundColor: "#43a047",
    marginRight: "3px"
  },

  chatBoxContainer: {
    height: "auto",
    padding: '20px 20px 0 20px'
  },

  senderChatWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 13
  },

  senderBox: {
    maxWidth: "40%",
    padding: 12,
    background: "#f5f5f5",
    color: "#263238",
    borderRadius: 5
  },

  time: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px"
  },

  receiverChatWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 13
  },

  receiverBox: {
    maxWidth: "40%",
    padding: 12,
    background: "#983cac",
    color: "#fff",
    borderRadius: 5
  },

  messageWrapper: {
    padding: 5,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "auto"
  },

  warningMessage: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    background: "#fea000",
    color: "white",
    padding: 3,
    borderRadius: 10
  },

  messageLoader: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column", 
    alignItems: "center",
    marginTop: 50
  },

  chatHover: {
    cursor: "pointer",
    color: "#ffff",
    paddingTop: "31px",
    marginLeft: 5,
    "&:hover": {color: 'gray'}
  },
  // End ChatPageBox

  // ChatInfo
  chatInfoHeader: {
    padding: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  avatarLarge: {
    width: 100,
    height: 100,
    marginBottom: 10
  },

  photosTitle: {
    padding: 5,
    display: "flex",
    justifyContent: "center"
  },

  photosGridContainer: {
    height: 430,
    overflowY: "auto",
    padding: 5
  },
  filesGridContainer: {
    height: 406,
    overflowY: "auto",
    padding: 5
  },
  photosGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  textAreaChat: {
    resize: "none",
    background: "none",
    border: "none",
    overflow: "auto",
    outline: "none",
    lineHeight: "1.5",
    boxShadow: "none",
    fontSize: "16px",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif"
    ]
  },

  chatImage: {
    color: "#000",
    maxWidth: "40%",
    overflowWrap: "break-word",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    "@media (max-width: 425px)": {
      maxWidth: "191px",
      padding: "6px 12px"
    }
  },

  chip: {
    margin: theme.spacing(1)
  },

  dense: {
    marginTop: theme.spacing(2)
  },

  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  memberList: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
    maxHeight: 70,
    padding: 5,
    overflowY: "auto"
  },
  //snippet 
  snippet: {
    color: "#000",
    width: "67vh",
    overflowWrap: "break-word",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    "@media (max-width: 425px)": {
      maxWidth: "191px",
      padding: "6px 12px"
    }
  },
  snippetTime: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "10px"
  }
  // End ChatInfo
});

export default styles;
