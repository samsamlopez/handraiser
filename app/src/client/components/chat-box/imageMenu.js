import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ImageSearch from '@material-ui/icons/ImageSearch';
import Computer from '@material-ui/icons/Computer';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function ImageMenu(props) {

  const { 
    open, 
    handleClose, 
    fileRef,
    openSplash
  } = props;
  return (
      <StyledMenu
        id="customized-menu"
        anchorEl={open}
        keepMounted
        open={Boolean(open)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={() => {
          handleClose()
          fileRef.click()
        }}>
          <ListItemIcon>
            <Computer />
          </ListItemIcon>
          <ListItemText primary="Upload from computer" />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => {
          handleClose()
          openSplash();
        }}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <ListItemText primary="Search for GIF" />
        </StyledMenuItem>
      </StyledMenu>
  );
}