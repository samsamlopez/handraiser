import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, Box, Typography, Avatar, Chip, Divider
} from '@material-ui/core';
//API
import api from "../../../../services/fetchApi";

const styles = theme => ({
  avatar: {
    marginTop: 20,
    '@media (max-width: 460px)' : {
        display: "none"
    } 
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  img: {
    width: 50,
    height: 50
  },
  chip: {
    marginTop: 10
  },
  respGrid: {
    '@media (max-width: 460px)' : {
        maxWidth: '100%',
        flexBasis: '100%'
    } 
  }
});

class ConcernItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dataLoaded: false,
            helpedBy: null,
            details: null
        }
    }

    componentDidMount(){
        api.fetch(`/api/history/details/${this.props.concern.id}`, "get").then(res => {
            api.fetch(`/api/helpedby/${this.props.concern.mentor_id}`, "get").then(resp => {
                this.setState({
                    details: res.data.history[0],
                    helpedBy: resp.data.mentor[0],
                    dataLoaded: true
                })
            })
        });
    } div

    render(){
        const { classes, concern } = this.props;
        const { details, dataLoaded, helpedBy } = this.state;
        if (dataLoaded){
            return (
                <React.Fragment>
                    <Box className={classes.paper}>
                        <Grid container spacing={2}>
                            <Grid item className={classes.avatar}>
                                <Avatar alt="" className={classes.img} src={details.avatar} />
                            </Grid>
                            <Grid className={classes.respGrid} item xs={10} sm container>
                                <Grid style={{ maxHeight: 120 }} item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                    {details.first_name + " " + details.last_name}
                                    </Typography>
                                    <Typography variant="overline" color="textSecondary" gutterBottom>
                                    Concern:
                                    </Typography>
                                    <Typography variant="body2">
                                        {concern.reason ? concern.reason : "No concern specified."}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                        <Typography variant="body2" color="textSecondary">
                                            Helped by:
                                        </Typography>
                                        <Chip
                                            className={classes.chip}
                                            avatar={<Avatar alt="" src={helpedBy.avatar} />}
                                            label={helpedBy.first_name + " " + helpedBy.last_name}
                                        />
                                        <Box>
                                            <Typography variant="overline" color="textSecondary" gutterBottom>
                                                {details.time}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider light />
                </React.Fragment>
            );
        }
        else return null
    }
}
export default withStyles(styles)(ConcernItem);
