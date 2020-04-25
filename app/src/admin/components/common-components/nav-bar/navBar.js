import React from 'react';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

import AuthService from '../../../auth/services';

const drawerWidth = 240;

const styles = theme => ({
  appBarBg: {
    backgroundColor: '#780aaf',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  avatar: {
    width: '40px',
    height: '40px',
    fontSize: '18px',
    boxShadow: 'none',
    cursor: 'pointer',
  },
  menuPaper: {
    marginTop: '2.2%'
  },
  menuList: {
    width: '330px',
    height: '130px',
  },
  menuGridIcon: {
    padding: '8% 2% 5% 4.6%',
  },
  menuAvatar: {
    width: '80px',
    height: '80px',
    fontSize: '40px',
    boxShadow: 'none',
  },
  menuGridDetails: {
    padding: '5% 1% 0 2%'
  },
  name: {
    fontSize: '15px',
    fontWeight: 'bold'
  },
  email: {
    paddingBottom: '12%',
    fontSize: '14px',
    color: '#676767',
  }
});

class NavBar extends React.Component {
  constructor() {
    super();

    this.Auth = new AuthService();

    this.state = {
      anchor: null
    }
  }

  handleDrawerOpen = () => this.props.handleDrawerOpenFn();

  logout = () => {
    this.Auth.logout();
  }

  render() {
    const { classes } = this.props;
    return (
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.props.open,
          })}
          classes={{colorPrimary: classes.appBarBg}}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, this.props.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap style={{flexGrow: 1}}>
              {this.props.title}
            </Typography>

            <Tooltip title="Logout" placement="bottom-end">
              <IconButton onClick={this.logout}>
                <ExitToAppIcon style={{color: 'white'}} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
    );
  }
}

export default withStyles(styles)(NavBar);
