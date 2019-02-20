import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import List from "@material-ui/core/List/List";
import Fab from "@material-ui/core/Fab/Fab";
import Icon from "@material-ui/core/Icon/Icon";
import PropTypes from "prop-types";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";

const styles = (theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  column: {
    flexBasis: '33.33%',
  },
  textField: {
    paddingRight: 8
  },
})

const Topics = ({classes, topics}) => {

  let topicToListItem = topic =>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <div className={classes.column}>
            <Typography className={classes.heading}>{topic.name}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{topic.id}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Grid container>
            <Grid item xs={12} sm={6}><TextField label={"Name"} value={topic.name} className={classes.textField} fullWidth/></Grid>
            <Grid item xs={12} sm={6}><TextField label={"ID"} value={topic.id} className={classes.textField} fullWidth/></Grid>
          </Grid>
        </ExpansionPanelDetails>
        <Divider/>
        <ExpansionPanelActions>
          <Button size="small">Cancel</Button>
          <Button size="small" color="primary">
            Save
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>


  return (
    <div>
      {topics.map(topicToListItem)}
      <List>
      </List>
      <Fab color="primary" className={classes.fab}>
        <Icon>add</Icon>
      </Fab>
    </div>)
};

Topics.propTypes = {
  topics: PropTypes.array
};

Topics.defaultProps = {
  topics: [
    {
      "id": "traffic",
      "name": "Doprava"
    },
    {
      "id": "culture",
      "name": "Kultura"
    },
    {
      "id": "events",
      "name": "Akce"
    },
    {
      "id": "news",
      "name": "Zprávy"
    },
    {
      "id": "tourism",
      "name": "Turismus"
    },
    {
      "id": "life",
      "name": "Život v Brně"
    },
    {
      "id": "work",
      "name": "Práce"
    },
    {
      "id": "places",
      "name": "Místa"
    },
    {
      "id": "sport",
      "name": "Sport"
    }
  ]
};

export default withStyles(styles)(Topics)
