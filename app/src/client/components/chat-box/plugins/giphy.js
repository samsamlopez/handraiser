import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  withWidth,
  TextField,
  IconButton,
  InputAdornment
} from "@material-ui/core";
import Search from "@material-ui/icons/Search";
import axios from "axios";

const styles = theme => ({
  title: {
    paddingTop: 35,
    minHeight: 100,
    backgroundColor: "#780aaf",
    color: "white",
    textAlign: "center"
  },
  emptyQueue: {
    marginTop: 45,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    "@media (max-width: 425px)": {
      marginTop: 160
    }
  },
  subtitle: {
    marginTop: 20
  },
  gifItem: {
    display: "grid",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "2px 2px 4px 0 #ccc",
    boxSizing: "border-box",
    margin: "0 0 1.5em",
    padding: "1em",
    width: "100%"
  },
  gifList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    columnGap: "1.5em",
    fontSize: ".85em",
    margin: "1.5em 0",
    padding: 0
  }
});

class Splash extends React.Component {
  constructor() {
    super();
    this.state = {
      trendPage: 1,
      resultPage: 1,
      trending: [],
      query: " ",
      showTrend: true,
      results: [],
      countPrev: 0,
      noMoreGif: false
    };
  }
  componentDidMount = () => {
    axios
      .get(
        `http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_.API_GIPHY_KEY}&limit=9`
      )
      .then(res => {
        this.setState({
          trending: [...res.data.data],
          trendPage: this.state.trendPage + 9
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  moreTrend = () => {
    this.setState({ trendPage: this.state.trendPage + 9 });
    axios
      .get(
        `http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_.API_GIPHY_KEY}&limit=10&offset=${this.state.trendPage}`
      )
      .then(res => {
        this.setState({
          trending: this.state.trending.concat(res.data.data)
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleChange = query => {
    this.setState({ query });
  };
  handleSubmit = () => {
    axios
      .get(
        `http://api.giphy.com/v1/gifs/search?q=${this.state.query}&api_key=${process.env.REACT_APP_.API_GIPHY_KEY}&limit=9`
      )
      .then(res => {
        this.setState({
          showTrend: false,
          results: [...res.data.data],
          resultPage: this.state.resultPage + 9
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  more = () => {
    this.setState({ resultPage: this.state.resultPage + 9 });
    axios
      .get(
        `http://api.giphy.com/v1/gifs/search?q=${this.state.query}&api_key=${process.env.REACT_APP_.API_GIPHY_KEY}&limit=10&offset=${this.state.resultPage}`
      )
      .then(res => {
        this.setState({
          results: this.state.results.concat(res.data.data)
        });
        if (this.state.countPrev === this.state.results.length) {
          this.setState({ noMoreGif: true });
        } else {
          this.setState({
            countPrev: this.state.results.length,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  closeDialog = () => {
    this.setState({
      query: " ",
      results: [],
      showTrend: true
    });
  };
  render() {
    const { width, classes, open, handleClose, uploadGif } = this.props;
    return (
      <Dialog
        maxWidth="sm"
        fullWidth
        fullScreen={width === "xs" ? true : false}
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onExited={this.closeDialog}
      >
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h4">Search for GIFs</Typography>
          <Typography variant="overline">&copy; giphy</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-name"
            label="Name"
            fullWidth
            onChange={e => this.handleChange(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={this.handleSubmit}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              )
            }}
            onKeyUp={e => {
              if (
                e.target.value
                  .replace(/^\s+/, "")
                  .replace(/\s+$/, "") !== ""
              ) {
                if (e.key === "Enter") {
                  this.handleSubmit();
                }
              }
            }}
          />
          {this.state.showTrend ? (
            <div className={classes.gifList}>
              {this.state.trending.map(tile => (
                <div
                  key={tile.id}
                  className={classes.gifItem}
                  onClick={() => uploadGif(tile)}
                >
                  <img
                    style={{ width: "100%" }}
                    src={tile.images.downsized.url}
                    alt=""
                  />
                </div>
              ))}
              <div
                className={classes.gifItem}
                style={{ cursor: "pointer", height: "309px" }}
                onClick={this.moreTrend}
              >
                <img
                  alt="no more images"
                  style={{
                    width: "12%",
                    margin: "auto auto 0 auto"
                  }}
                  src={
                    "https://www.pngarts.com/files/3/Next-Button-PNG-Free-Download.png"
                  }
                />
                <p
                  style={{
                    margin: "-74px auto 0 auto",
                    color: "#656565"
                  }}
                >
                  show more
                </p>
              </div>
            </div>
          ) : (
            <div className={classes.gifList}>
              {this.state.results.map(tile => (
                <div
                  key={tile.id}
                  className={classes.gifItem}
                  onClick={() => uploadGif(tile)}
                >
                  <img
                    style={{ width: "100%" }}
                    src={tile.images.downsized.url}
                    alt=""
                  />
                </div>
              ))}
              {this.state.results.length >= 9 && !this.state.noMoreGif
              ? <div
                className={classes.gifItem}
                style={{ cursor: "pointer", height: "309px" }}
                onClick={this.more}
                >
                <img
                  alt="no more images"
                  style={{
                    width: "12%",
                    margin: "auto auto 0 auto"
                  }}
                  src={
                    "https://www.pngarts.com/files/3/Next-Button-PNG-Free-Download.png"
                  }
                />
                <p
                  style={{
                    margin: "-74px auto 0 auto",
                    color: "#656565"
                  }}
                >
                  show more
                </p>
              </div>
            :null
            }
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withWidth()(withStyles(styles)(Splash));
