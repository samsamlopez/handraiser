import Background from "../../images/bg.jpg";

const styles = theme => ({
  "@global": {
    body: {
      backgroundImage: `linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5) ), url(${Background})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    },
    html: {
      height: "100%",
      margin: 0
    }
  },
  paper: {
    marginTop: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5%",
    backgroundColor: "#ffffffa1",
    borderRadius: "5px"
  },
  form: {
    width: "100%",
    marginTop: 1
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#630184"
  },
  title: {
    marginBottom: "10%",
    color: "#272727"
  },
  submit: {
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#9129aa",
    color: "#fff",
    padding: "12px 0",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#a43cbd"
    }
  },
  studentBtn: {
    backgroundColor: "#6525dc",
    "&:hover": {
      backgroundColor: "#784bce"
    }
  },
  footer: {
    margin: "10% auto 0 auto"
  },
  inputLabel: {
    "&.Mui-focused": {
      color: "#802693"
    }
  },
  inputField: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#802693"
    },
    "&:after": {
      borderColor: "#802693"
    }
  },
  signInBtn: {
    color: "white",
    backgroundColor: "#802693",
    "&.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.26)",
      backgroundColor: "white"
    },
    "&:hover": {
      color: "white",
      backgroundColor: "#9932af"
    }
  }
});
export default styles;
