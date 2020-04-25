import { fade } from "@material-ui/core/styles";

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
  stickyHeader: {
    position: "sticky",
    top: "0",
    backgroundColor: "#ececec ",
    zIndex: "1"
  },
  cardContact: {
    height: "840px"
  },
  cardHeader: {
    backgroundColor: "#696968",
    color: "#ffffff",
    height: "32px"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  actionSearch: {
    marginTop: "0%",
    marginRight: "0%"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 320,
      "&:focus": {
        width: 400
      }
    }
  },
  inputField: {
    textAlign: "center",
    color: "#005406",
    letterSpacing: "2px"
  },
  row: {
    "&:hover": {
      backgroundColor: "#f7f7f7"
    }
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
      backgroundColor: "#ececec",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    }
  },
  iconSort: {
    fontSize: "17px",
    marginTop: "1px",
    position: "absolute"
  }
});

export default styles;
