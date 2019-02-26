import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types"
import {compose, withHandlers, withState} from "recompose"
import Icon from "@material-ui/core/Icon/Icon";

const styles = (theme) => ({
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

const Topic = ({id, textId, name, handleSubmit, handleDelete, classes, handleNameChange, handleTextIdChange, submitButtonText}) => {

  let details =
    <Grid container>
      <Grid item xs={12} sm={6}>
        <TextField label={"Name"} value={name} onChange={handleNameChange} className={classes.textField} fullWidth/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label={"ID"} value={textId} onChange={handleTextIdChange} className={classes.textField} fullWidth/>
      </Grid>
    </Grid>;


  return (
    <ExpansionPanel defaultExpanded={textId === ""}>

      <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
        <div className={classes.column}>
          <Typography className={classes.heading}>{name}</Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>{textId}</Typography>
        </div>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails className={classes.details}>
        {details}
      </ExpansionPanelDetails>

      <Divider/>
      <ExpansionPanelActions>
        <Button onClick={handleDelete} size="small">Delete</Button>
        <Button onClick={handleSubmit} size="small" color="primary">{submitButtonText}</Button>
      </ExpansionPanelActions>

    </ExpansionPanel>
  )
}

Topic.propTypes = {
  id: PropTypes.number,
  textId: PropTypes.string,
  name: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleDelete: PropTypes.func,
  submitButtonText: PropTypes.string
}

Topic.defaultProps = {
  id: 0,
  textId: "",
  name: "",
  handleSubmit: () => {
  },
  handleDelete: () => {
  },
  submitButtonText: "Save"
}

export default compose(
  withStyles(styles),
  withState('name', 'updateName', props => props.name),
  withState('textId', 'updateTextId', props => props.textId),
  withState('id', 'updateId', props => props.id),
  withHandlers({
    handleNameChange: props => event => {
      props.updateName(event.target.value)
    },
    handleTextIdChange: props => event => {
      props.updateTextId(event.target.value)
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.handleSubmit({
        id: props.id,
        textId: props.textId,
        name: props.name
      })
    },
    handleDelete: props => event => {
      event.preventDefault();
      props.handleDelete({
        id: props.id,
        textId: props.textId,
        name: props.name
      })
    },
  }),
)(Topic)
