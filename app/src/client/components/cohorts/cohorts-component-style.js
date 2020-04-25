const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: "2%",
    marginLeft: 0
  },
  contentShift: {
    marginLeft: 0
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  container: {
    paddingTop: "1%",
    paddingLeft: 0,
    paddingRight: 0,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "column"
  },
  mentor: {
    maxWidth: 1000,
    minWidth: 300,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    margin: "0 auto"
  },
  student: {
    maxWidth: 1000,
    minWidth: 300,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    margin: "0 auto"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#e0e0e0",
    "&:hover": {
      backgroundColor: "#e0e0e0"
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginBottom: theme.spacing(3),
    width: "100%",
    "@media (max-width: 425px)": {
      marginLeft: theme.spacing(2),
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
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    "@media (max-width: 425px)": {
      width: "100%"
    }
  },
  emptyQueue: {
    paddingTop: theme.spacing(8),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  header: {
    marginBottom: theme.spacing(1)
  },
  cohortContainer: {
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 425px)": {
      marginLeft: "12px"
    }
  },
  mentorClassCard: {
    "@media (max-width: 900px)": {
      flexDirection: "column"
    },
    "@media (min-width: 901px) and (max-width: 1044px)": {
      paddingLeft: "12%"
    }
  },
  enrolledClassCon: {
    "@media (max-width: 900px)": {
      flexDirection: "column"
    },
    "@media (min-width: 901px) and (max-width: 1044px)": {
      paddingLeft: "12%"
    }
  },
  availablesClassCon: {
    "@media (max-width: 1059px)": {
      flexDirection: "column"
    }
  }
});

export default styles;
