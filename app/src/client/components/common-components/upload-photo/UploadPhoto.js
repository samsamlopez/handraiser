import React, { createRef } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Dropzone from "react-dropzone";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import UploadIcon from "../../../images/upload.png";
import SearchImageIcon from "../../../images/searchImage.png";

//API
import api from "../../../services/fetchApi";

//Loader
import Loader from "../loader/loader";

import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from "./ReusableUtils";

//File Upload
import S3FileUpload from "react-s3";
//config AMAZON S3
const config = {
  bucketName: "boomcamp",
  dirName: "handraiser/image-uploads/class-headers" /* optional */,
  region: "us-west-2",
  accessKeyId: "AKIAQQHQFF5EPNACIXE3",
  secretAccessKey: "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"
};

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    paddingBottom: "0px"
  },
  tabs: {
    minWidth: "50px",
    padding: "12px 12px 0 12px",
    "@media (max-width: 425px)": {
      fontSize: "12px",
      padding: "12px 12px 0 5px"
    }
  },
  indicator: {
    "@media (max-width: 425px)": {
      width: "65px !important"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#e0e0e0",
    "&:hover": {
      backgroundColor: "#e0e0e0"
    },
    width: "100%"
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
    height: "30px",
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "896px",
    [theme.breakpoints.up("md")]: {
      width: "896px"
    },
    "@media (max-width: 425px)": {
      height: "16px",
      fontSize: "13px",
      padding: "10px 8px 8px 48px"
    }
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  uploadContent: {
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
  uploadBtn: {
    backgroundColor: "#ebebff",
    "&:hover": {
      backgroundColor: "#e4e4ff"
    }
  },
  container: {
    paddingTop: "14%",
    paddingBottom: "14%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 425px)": {
      paddingTop: "42%"
    },
    "@media (min-width: 426px) and (max-width: 766px)": {
      paddingTop: "20%"
    }
  },
  cropContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  uploadDiv: {
    width: "100px",
    marginRight: "auto",
    marginLeft: "auto"
  },
  uploadIcon: {
    cursor: "pointer",
    backgroundImage: `url(${UploadIcon})`,
    height: "80px",
    width: "84px",
    marginLeft: "13%",
    backgroundRepeat: "no-repeat",
    "@media (max-width: 425px)": {
      backgroundSize: "contain",
      marginLeft: "0",
      width: "50px",
      marginBottom: "-22px"
    }
  },
  searchImageIcon: {
    backgroundImage: `url(${SearchImageIcon})`,
    height: "80px",
    width: "84px",
    marginLeft: "12%",
    backgroundRepeat: "no-repeat",
    "@media (max-width: 425px)": {
      backgroundSize: "contain",
      marginLeft: "24px",
      width: "50px",
      marginBottom: "-22px"
    }
  },
  selectBtn: {
    textTransform: "none",
    backgroundColor: "#f2f2f2",
    borderRadius: "2px",
    border: "1px solid #d8d8d8",
    padding: "2px 8px",
    fontSize: "12px",
    "@media (max-width: 425px)": {
      fontSize: "9px"
    }
  },
  largeImage: {
    width: "500px"
  },
  smallImage: {
    width: "417px"
  },
  fadeIn: {
    textAlign: "center",
    borderColor: "#202020",
    backgroundColor: "#484848",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "11px",
    height: "15px",
    padding: "6px",
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: "11%",
    right: "11%",
    opacity: "1",
    transition: "opacity 1s linear"
  },
  fadeOut: {
    textAlign: "center",
    borderColor: "#202020",
    backgroundColor: "#484848",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "11px",
    height: "15px",
    padding: "6px",
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: "11%",
    right: "11%",
    opacity: "0",
    transition: "opacity 1s linear"
  },
  imageItem: {
    display: "grid",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "2px 2px 4px 0 #ccc",
    boxSizing: "border-box",
    margin: "0 0 1.5em",
    padding: "1em",
    width: "100%"
  },
  imageList: {
    height: "330px",
    width: "922px",
    maxHeight: "361px",
    overflow: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    columnGap: "1.5em",
    fontSize: ".85em",
    padding: "2%",
    "&::-webkit-scrollbar": {
      width: "0.3em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#b3b3b3",
      borderRadius: "10px",
      outline: "1px solid slategrey"
    },
    "@media (max-width: 425px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      width: "96%"
    },
    "@media (min-width: 426px) and (max-width: 1023px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
      width: "96%"
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
      width: "96%"
    }
  },
  cropInstruction: {
    fontSize: "12px",
    "@media (max-width: 425px)": {
      fontSize: "8.5px"
    }
  },
  dragPhoto: {
    fontSize: "25px",
    color: "#a8a8a8",
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  or: {
    fontSize: "18px",
    color: "#a8a8a8",
    "@media (max-width: 425px)": {
      fontSize: "12px"
    }
  },
  searchAnImage: {
    fontSize: "25px",
    color: "#a8a8a8",
    "@media (max-width: 425px)": {
      fontSize: "15px"
    }
  },
  btn: {
    "@media (max-width: 425px)": {
      fontSize: "10px"
    }
  },
  searchContainer: {
    height: "483px",
    padding: "0",
    overflow: "hidden",
    "@media (max-width: 425px)": {
      height: "435px"
    }
  },
  cropInsCron: {
    padding: "10px 0 4px 16px",
    "@media (max-width: 425px)": {
      padding: "9px 0 0 10px",
      marginBottom: "5px"
    }
  },
  credits: {
    fontSize: "12px",
    color: "#868686",
    marginTop: "1%",
    marginBottom: "1%",
    "@media (max-width: 425px)": {
      fontSize: "10px"
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}
const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

// UPLOAD IMAGE ATTRIBUTES
const imageMaxSize = 1000000000; // bytes
const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

const dropzoneRef = createRef();

class UploadPhoto extends React.Component {
  constructor() {
    super();
    this.imagePreviewCanvasRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.state = {
      tabValue: 0,
      search: "",
      searchLoader: false,
      file: [],
      imgUrl: "",
      imgSrc: null,
      imgSrcExt: null,
      errorMsg: false,
      warnNoMoreImages: false,
      crop: {
        unit: "%",
        height: 16.10294117647059,
        width: 48.34437086092716,
        x: 25,
        y: 43,
        aspect: 16 / 3
      },
      images: [],
      imageFound: "",
      page: 1,
      countPrevImages: 0,
      noMoreImages: false,
      loadingCrop: null,
      disabled: true
    };
  }

  dismiss = option => {
    if (option === "upload") {
      this.setState({
        file: [],
        imgSrc: null,
        imgSrcExt: null,
        errorMsg: false
      });
    } else {
      this.setState({
        search: "",
        images: [],
        file: [],
        imgSrc: null,
        imgSrcExt: null,
        errorMsg: false
      });
    }
  };

  clickUploadFile = () => {
    document.getElementById("file").click();
  };

  handleImageLoaded = image => {};

  handleOnCropChange = crop => {
    this.setState({ crop: crop, disabled: false });
  };

  handleOnCropComplete = (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;

      if (currentFileSize > imageMaxSize) {
        alert(
          "This file is not allowed. " + currentFileSize + " bytes is too large"
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not allowed. Only images are allowed.");
        return false;
      }
      return true;
    }
  };

  handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];
        const myFileItemReader = new FileReader();

        var changeState = this; // set the this to changeState for setState in line 214

        myFileItemReader.addEventListener(
          "load",
          () => {
            var img = new Image();
            img.src = myFileItemReader.result;

            img.onload = function() {
              if (img.width >= 800 && img.height >= 200) {
                const myResult = myFileItemReader.result;
                changeState.setState({
                  file: files,
                  imgSrc: myResult,
                  imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                });
              } else {
                changeState.setState({ errorMsg: true });
              }
            };
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  handleFileSelect = event => {
    this.setState({ errorMsg: false });
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();

        var changeState = this; // set the this to changeState for setState in line 214

        myFileItemReader.addEventListener(
          "load",
          () => {
            var img = new Image();
            img.src = myFileItemReader.result;

            img.onload = function() {
              if (img.width >= 800 && img.height >= 200) {
                const myResult = myFileItemReader.result;
                changeState.setState({
                  file: files,
                  imgSrc: myResult,
                  imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                });
              } else {
                changeState.setState({ errorMsg: true });
              }
            };
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  handleSelectClassHeader = event => {
    this.setState({ disabled: true });
    event.preventDefault();
    this.props.handleClose();
    this.props.uploadPhotoFn();
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;

      const { imgSrcExt } = this.state;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);

      const myFilename = `${this.props.cohortId}.` + imgSrcExt;

      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);

      //start file upload
      S3FileUpload.uploadFile(myNewCroppedFile, config)
        .then(data => {
          var url = data.location;
          this.setState({ imgUrl: url });
          api
            .fetch(`/upload/${this.props.cohortId}`, "POST", { url })
            .then(res => {
              this.setState({ imageURL: `${res.file}` });
              this.props.loadStateFn();
              this.props.uploadPhotoFn();
            });
        })
        .catch(err => {
          console.log(err);
        });
      //end file upload
    }
  };

  handleTabValue = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  /* SEARCH IMAGE */

  searchImage = () => {
    this.setState({
      loadingCrop: false,
      searchLoader: true,
      noMoreImages: false,
      countPrevImages: 0,
      page: 1,
      file: [],
      imgSrc: null,
      imgSrcExt: null
    });
    axios
      .get(`https://api.unsplash.com/search/photos?page=1`, {
        params: { query: this.state.search },
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_.API_UNPLASH_IMAGE_KEY}`
        }
      })

      .then(res => {
        this.setState({
          images: [...res.data.results],
          imageFound: res.data.results.length
        });
        setTimeout(() => {
          this.setState({
            searchLoader: false
          });
        }, 2000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  more = () => {
    axios
      .get(
        `https://api.unsplash.com/search/photos?page=${this.state.page + 1}`,
        {
          params: { query: this.state.search },
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_.API_UNPLASH_IMAGE_KEY}`
          }
        }
      )

      .then(res => {
        this.setState({
          images: this.state.images.concat(res.data.results),
          imageFound: res.data.results.length,
          page: this.state.page + 1
        });

        if (this.state.countPrevImages === this.state.images.length) {
          this.setState({ noMoreImages: true, warnNoMoreImages: true });
        } else {
          this.setState({
            countPrevImages: this.state.images.length
          });
        }

        setTimeout(() => {
          this.setState({
            searchLoader: false
          });
        }, 2000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  dismissNoMoreImages = () => {
    this.setState({ warnNoMoreImages: false });
  };

  getBase64Image = (img, url, height, width) => {
    this.setState({ loadingCrop: true });
    var filename = url.split("/");
    filename = filename[3].split("?");
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.width = width;
    c.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    this.setState({
      file: [
        {
          name: filename[0] + ".jpeg"
        }
      ],
      imgSrc: c.toDataURL(),
      imgSrcExt: "jpeg"
    });
    setTimeout(() => {
      this.setState({
        loadingCrop: false
      });
    }, 2000);
  };

  back = () => {
    this.setState({
      imgSrc: null
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <canvas id="myCanvas" style={{ display: "none" }} />

        <DialogTitle
          id="customized-dialog-title"
          onClose={this.props.handleClose}
        >
          Gallery
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabValue}
            indicatorColor="primary"
            textColor="primary"
            style={{ width: "100%", marginTop: "1%" }}
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              label="Upload"
              classes={{ textColorPrimary: classes.tabs }}
              onClick={() => this.dismiss("upload")}
            />
            <Tab
              label="Search"
              classes={{ textColorPrimary: classes.tabs }}
              onClick={() => this.dismiss("search")}
            />
          </Tabs>
        </DialogTitle>
        <TabPanel value={this.state.tabValue} index={0}>
          <DialogContent
            dividers
            style={{ height: "451px", overflow: "hidden" }}
            className={classes.uploadContent}
          >
            <div
              className={
                this.state.errorMsg ? `${classes.fadeIn}` : `${classes.fadeOut}`
              }
            >
              The photo that you uploaded is too small! It must be at least 800
              pixels wide and 200 pixels tall.
              <Link
                onClick={this.dismiss}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                {" "}
                Dismiss
              </Link>
            </div>

            {this.state.imgSrc === null ? (
              <Dropzone
                ref={dropzoneRef}
                noClick
                noKeyboard
                onDrop={this.handleOnDrop}
                accept={acceptedFileTypes}
                multiple={false}
                maxSize={imageMaxSize}
              >
                {({ getRootProps, getInputProps, acceptedFiles }) => {
                  return (
                    <React.Fragment>
                      <div style={{ fontSize: "10px" }}>
                        &#8250; It must be at least 800 pixels wide and 200
                        pixels tall
                      </div>
                      <Grid
                        container
                        {...getRootProps({ className: classes.container })}
                      >
                        <Grid
                          item
                          className={classes.upload112121212121212121211Div}
                        >
                          <div
                            className={classes.uploadIcon}
                            onClick={() => this.clickUploadFile()}
                          />
                        </Grid>
                        <Grid item>
                          <Typography
                            gutterBottom
                            className={classes.dragPhoto}
                          >
                            Drag a photo here
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography gutterBottom className={classes.or}>
                            - or -
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            className={classes.selectBtn}
                            onClick={() => this.clickUploadFile()}
                          >
                            Select a photo from your computer
                          </Button>

                          <input
                            style={{ display: "none" }}
                            id="file"
                            ref={ref => {
                              this.uploadInput = ref;
                            }}
                            type="file"
                            accept={acceptedFileTypes}
                            multiple={false}
                            onChange={this.handleFileSelect}
                          />
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  );
                }}
              </Dropzone>
            ) : (
              <React.Fragment>
                <Grid container>
                  <Grid item>
                    <Typography
                      gutterBottom
                      style={{
                        fontSize: "12px",
                        overflow: "hidden",
                        width: "920px"
                      }}
                    >
                      Upload &#8250; <b>{this.state.file[0].name}</b>
                    </Typography>
                    <Typography
                      gutterBottom
                      className={classes.cropInstruction}
                    >
                      To crop this image, drag the region below and then click
                      "Select class header"
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.cropContainer}>
                  <Grid item>
                    {this.state.imgSrc !== null ? (
                      <React.Fragment>
                        <ReactCrop
                          imageStyle={{ height: "340px" }}
                          src={this.state.imgSrc}
                          crop={this.state.crop}
                          onImageLoaded={this.handleImageLoaded}
                          onComplete={this.handleOnCropComplete}
                          onChange={this.handleOnCropChange}
                        />
                        <canvas
                          ref={this.imagePreviewCanvasRef}
                          style={{ display: "none" }}
                        ></canvas>
                      </React.Fragment>
                    ) : null}
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </DialogContent>
        </TabPanel>

        <TabPanel value={this.state.tabValue} index={1}>
          <DialogContent dividers className={classes.searchContainer}>
            <Grid container style={{ backgroundColor: "#efefef" }}>
              <Grid item>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    onChange={e => this.setState({ search: e.target.value })}
                    // onClick={() => this.props.displayBadge()}
                    onKeyUp={e => {
                      if (
                        e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s+$/, "") !== ""
                      ) {
                        if (e.key === "Enter") {
                          this.searchImage();
                        }
                      }
                    }}
                    value={this.state.search}
                    fullWidth
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
              </Grid>
            </Grid>

            {this.state.images.length === 0 ? (
              <Grid
                container
                className={classes.container}
                style={{ paddingTop: "140px" }}
              >
                <Grid item className={classes.uploadDiv}>
                  <div className={classes.searchImageIcon} />
                </Grid>
                <Grid item>
                  <Typography gutterBottom className={classes.searchAnImage}>
                    {this.state.imageFound === ""
                      ? "Search an image"
                      : "No image found"}
                  </Typography>
                </Grid>
              </Grid>
            ) : this.state.searchLoader || this.state.loadingCrop ? (
              <Loader
                content={
                  this.state.searchLoader ? "Loading..." : "Uploading image"
                }
                linear={this.state.loadingCrop ? true : false}
                width="500px"
              />
            ) : this.state.imgSrc !== null ? (
              <React.Fragment>
                <Grid container className={classes.cropInsCron}>
                  <Grid item>
                    <Typography
                      gutterBottom
                      style={{
                        fontSize: "12px",
                        overflow: "hidden",
                        width: "920px"
                      }}
                    >
                      Upload &#8250; <b>{this.state.file[0].name}</b>
                    </Typography>
                    <Typography
                      gutterBottom
                      className={classes.cropInstruction}
                    >
                      To crop this image, drag the region below and then click
                      "Select class header"
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={classes.cropContainer}
                  style={{ marginTop: "-25px" }}
                >
                  <Grid item>
                    {this.state.imgSrc !== null ? (
                      <React.Fragment>
                        <ReactCrop
                          imageStyle={{ height: "340px" }}
                          src={this.state.imgSrc}
                          crop={this.state.crop}
                          onImageLoaded={this.handleImageLoaded}
                          onComplete={this.handleOnCropComplete}
                          onChange={this.handleOnCropChange}
                        />
                        <canvas
                          ref={this.imagePreviewCanvasRef}
                          style={{ display: "none" }}
                        ></canvas>
                      </React.Fragment>
                    ) : null}
                  </Grid>
                </Grid>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid container className={classes.cropInsCron}>
                  <Grid item>
                    <Typography
                      gutterBottom
                      style={{
                        fontSize: "12px",
                        overflow: "hidden",
                        width: "920px",
                        color: "#616161"
                      }}
                    >
                      &#8250; <b>Select image to crop</b>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <div
                      className={
                        this.state.warnNoMoreImages
                          ? `${classes.fadeIn}`
                          : `${classes.fadeOut}`
                      }
                      style={{ marginTop: "1%" }}
                    >
                      Sorry, no more images found.
                      <Link
                        onClick={this.dismissNoMoreImages}
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          cursor: "pointer"
                        }}
                      >
                        {" "}
                        Dismiss
                      </Link>
                    </div>
                  </Grid>
                  <Grid item>
                    <div className={classes.imageList}>
                      {this.state.images.map((tile, i) => (
                        <div
                          key={i}
                          className={classes.imageItem}
                          onClick={() =>
                            this.getBase64Image(
                              document.getElementById(i),
                              tile.urls.regular,
                              tile.height,
                              tile.width
                            )
                          }
                        >
                          <img
                            crossOrigin="Anonymous"
                            id={i}
                            style={{ width: "100%" }}
                            src={tile.urls.regular}
                            alt={tile.alt_description}
                          />
                        </div>
                      ))}

                      {this.state.images.length >= 10 &&
                      this.state.noMoreImages === false ? (
                        <div
                          className={classes.imageItem}
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
                            more images
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </Grid>
                </Grid>

                <Grid>
                  <div>
                    <Typography align="center" className={classes.credits}>
                      © Unplash Image
                    </Typography>
                  </div>
                </Grid>
              </React.Fragment>
            )}
          </DialogContent>
        </TabPanel>

        <DialogActions>
          {this.state.imgSrc !== null ? (
            <Button
              className={classes.btn}
              onClick={this.back}
              color="primary"
              style={{ position: "absolute", left: "0" }}
            >
              Back
            </Button>
          ) : null}
          <Button
            id="btnSelectClassHeader"
            className={classes.btn}
            classes={{ textPrimary: classes.uploadBtn }}
            onClick={e => this.handleSelectClassHeader(e)}
            color="primary"
            disabled={
              this.state.imgSrc === null ||
              this.state.disabled ||
              (this.state.crop.width === 0 && this.state.crop.height === 0)
                ? true
                : false
            }
          >
            Select class header
          </Button>
          <Button
            className={classes.btn}
            onClick={this.props.handleClose}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UploadPhoto);
