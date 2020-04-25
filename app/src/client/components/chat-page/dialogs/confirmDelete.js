import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class ConfirmDelete extends Component {
    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => {
                        this.props.close();
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="xs"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete Member"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Remove '{this.props.user.first_name} {this.props.user.last_name}' in this group?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.props.close();
                        }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={()=>{
                            this.props.close();
                            this.props.deleteMember(this.props.user.sub, this.props.groupId)
                        }} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ConfirmDelete;