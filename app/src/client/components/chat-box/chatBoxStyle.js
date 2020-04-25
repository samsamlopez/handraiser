const styles = theme => ({
  rightTopNav: {
    padding: theme.spacing(1, 3),
    maxWidth: "auto",
    display: "flex",
    alignItems: "center",
    boxShadow: " 0px 0px 3px 0px rgba(176,173,176,1)",
    borderBottom: "1.2px solid #d4d2d2",
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px"
  },
  helpStatus: {
    padding: theme.spacing(2, 3),
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: "#802695",
    color: "white",
    justifyContent: "center",
    borderRadius: 0,
    wordBreak: "break-word",
    maxHeight: "57px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#9b58ab",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  },

  rightNav: {
    position: "relative",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px"
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

  chatName: {
    fontWeight: 500,
    flexGrow: 1,
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  status: {
    display: "flex",
    alignItems: "center"
  },
  statusIndic: {
    backgroundColor: "#43a047"
  },
  ab: {
    width: "8px",
    height: "8px"
  },
  cd: {
    display: "inline-block"
  },
  ef: {
    borderRadius: "50%",
    backgroundColor: "#43a047",
    marginRight: "10px"
  },
  sendIcon: {
    float: "right"
  },
  textField: {
    margin: "11px 5px",
    "@media (max-width: 425px)": {
      margin: "8px 5px",
      fontSize: 5
    }
  },
  userAvatar: {
    width: 38,
    height: 38,
    margin: 15,
    "@media (max-width: 425px)": {
      width: 30,
      height: 30,
      margin: 7
    }
  },
  chatAvatar: {
    width: 30,
    height: 30,
    marginRight: 15,
    "@media (max-width: 425px)": {
      width: 28,
      height: 28,
      marginRight: 5,
      marginLeft: "-9px"
    }
  },
  footerInput: {
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    backgroundColor: "#f7f7f7",
    display: "flex",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    position: "absolute",
    // height: "85px",
    "@media (max-width: 425px)": {
      height: "70px"
    }
  },
  chatBoxBody: {
    maxWidth: "auto",
    width: "100%"
  },
  custom: {
    maxHeight: "auto"
  },
  chatContentWrapper: {
    padding: "15px 15px 0 15px",
    overflowY: "auto",
    height: "auto",
    maxHeight: "435px",
    "@media (max-height: 425px)": {
      maxHeight: "485px",
      minHeight: "490px"
    }
  },
  chatContent: {
    display: "flex",
    justifyContent: "flex-start",
    maxWidth: "500px",
    marginBottom: 12
  },
  chatDetails: {
    color: "#263238",
    maxWidth: 270,
    overflowWrap: "break-word",
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    "@media (max-width: 425px)": {
      maxWidth: "191px",
      padding: "6px 12px"
    }
  },
  chatDetails2: {
    color: "#fff",
    maxWidth: 270,
    overflowWrap: "break-word",
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#983cac;",
    "@media (max-width: 425px)": {
      maxWidth: "191px",
      padding: "6px 12px"
    }
  },
  chatImage: {
    color: "#000",
    maxWidth: 270,
    overflowWrap: "break-word",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    "@media (max-width: 425px)": {
      maxWidth: "191px",
      padding: "6px 12px"
    }
  },
  chatText: {
    fontSize: 15,
    "@media (max-width: 425px)": {
      fontSize: 13
    }
  },
  chatContent2: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 12
    //  flexDirection: "row-reverse"
  },
  chatTime: {
    display: "flex",
    justifyContent: "flex-end",
    "@media (max-width: 425px)": {
      marginTop: 2
    }
  },
  mentorStyle: {
    position: "relative",
    boxShadow:
      "0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px"
  },
  mentorStyle1: {
    boxShadow: 0,
    elavation: 0
  },
  footerDone: {
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    backgroundColor: "#983cac",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    position: "absolute",
    height: "70px",
    "@media (max-width: 425px)": {
      height: "35px"
    }
  },
  chatInfo: {
    color: "#f7f7f7",
    textTransform: "uppercase",
    fontSize: 14,
    "@media (max-width: 425px)": {
      height: "40px",
      fontSize: 9.8,
      alignItems: "center",
      display: "flex"
    }
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
  },
  chatHover: {
    cursor: "pointer",
    color: "#ffff",
    paddingTop: "25px",
    marginLeft: 5,
    "&:hover": {color: 'gray'}
  }

});

export default styles;
