import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  withWidth,
  TextField,
  MenuItem
} from "@material-ui/core";
import Transition from "../gallery/transition";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/mode/html";
import "brace/mode/css";
import "brace/theme/monokai";

const styles = theme => ({
    dialogContent: {
        background: '#272822'
    },
    grid: {
        width: '100%', 
        display: 'grid', 
        gridTemplateColumns: '1fr 6fr',
        paddingLeft: 16 
    },
    white: {
        color: 'white'
    }
});

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#2c8a0d',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#2c8a0d',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
            borderColor: '#d64f4f',
            },
            '&:hover fieldset': {

            borderColor: 'red',
            },
            '&.Mui-focused fieldset': {
            borderColor: '#2c8a0d',
            },
        },
    },
})(TextField);
  

const modes = [
    {name: "JavaScript", value: "javascript"},
    {name: "HTML", value: "html"},
    {name: "CSS", value: "css"},
]

class Snippet extends React.Component {
    constructor(){
        super();
        this.state = {
            code: '',
            mode: "html"
        }
    }
    onChange = newCode => {
        this.setState({ code: newCode })
    }
    handleMode = event => {
        this.setState({ mode: event.target.value })
    }
    render(){
        const {
            width,
            classes,
            open,
            sendChat,
            sendGroup,
            handleClose,
            type
        } = this.props;
        return (
            <Dialog
                fullWidth
                maxWidth="md"
                fullScreen={width === 'xs' ? true : false}
                open={open}
                TransitionComponent={Transition}
                onClose={() => {
                    this.setState({ code: '' })
                    handleClose()
                }}
            >
                <DialogContent className={classes.dialogContent}>
                    <AceEditor
                    wrapEnabled
                    focus
                    width="auto"
                    fontSize="16px"
                    value={this.state.code}
                    height="62vh"
                    mode={this.state.mode}
                    theme="monokai"
                    onChange={this.onChange}
                    />
                </DialogContent>
                <DialogActions className={classes.dialogContent}>
                    <div className={classes.grid}>
                        <CssTextField
                        InputProps={{
                            className: classes.white
                        }}
                        InputLabelProps={{
                            className: classes.white
                        }}
                        margin="normal"
                        variant="outlined"
                        select
                        label="Mode"
                        value={this.state.mode}
                        onChange={this.handleMode}
                        >
                        {modes.map(mode => (
                            <MenuItem key={mode.value} value={mode.value}>
                                {mode.name}
                            </MenuItem>
                        ))}
                        </CssTextField>
                    </div>
                    <Button 
                    style={{ color: 'white' }} 
                    onClick={() => {
                        if (type === 'pm'){
                            sendChat(this.state.code, this.state.mode)
                        }
                        else {
                            sendGroup(this.state.code, this.state.mode)
                        }
                        this.setState({ code: '' })
                        handleClose()
                    }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withWidth()(withStyles(styles)(Snippet));