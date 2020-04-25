const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  paper: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  cardContact: {
    height: "840px"
  },
  cardHeader: {
    backgroundColor: "#696968",
    color: "#ffffff",
    height: "32px"
  },
  scroll: {
    maxHeight: "745px",
    overflow: "auto",
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
  name: {
    color: "#263238",
    fontSize: "15px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: "500",
    lineHeight: "20px",
    letterSpacing: "-0.05px"
  },
  itemSettings: {
    display: "flex",
    alignItems: "center"
  },
  settingsBtn: {
    position: "absolute",
    bottom: "10px",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    "@media (max-width: 425px)": {
      marginTop: 20,
      bottom: "0"
    }
  },
  changePasswordCard: {
    margin: "2%",
    width: "500px",
    height: "340px"
  },
  passwordCardHeader: {
    backgroundColor: "#d2d2d2",
    color: "#757575",
    height: "5px"
  },
  passwordCartTitle: {
    fontSize: "15px"
  },
  input: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9b44af"
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336 !important"
    },
    "@media (max-width: 425px)": {
      height: "40px",
      fontSize: "13px"
    }
  },
  label: {
    "&.Mui-error": {
      color: "#f44336 !important"
    },
    "&.Mui-focused": {
      color: "#9b44af"
    },
    "&.MuiInputLabel-shrink": {
      background: "white",
      paddingLeft: "6px",
      paddingRight: "6px"
    },
    "@media (max-width: 425px)": {
      fontSize: "11px",
      marginTop: "-6px",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, 2px) scale(0.75)"
      }
    }
  }
});

export default styles;
