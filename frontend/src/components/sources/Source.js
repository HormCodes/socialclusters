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
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";

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
  selector: {
    paddingRight: 8
  }
})

// TODO - Default selections

const Source = (
  {
    platform,
    valueType,
    value,
    handleSubmit,
    handleDelete,
    classes,
    handlePlatformChange,
    handleValueTypeChange,
    handleValueChange,
    handleTextIdChange,
    submitButtonText
  }
) => {


  const QUOTE = "\"";
  const ID = "ID";

  let platforms = [
    {
      name: "Twitter",
      value: "twitter",
      valueTypes: [
        {name: "Account", value: "account", valueLabel: "Username", valuePrefix: "@", valuePostfix: ""},
        {name: "Hashtag", value: "hashtag", valueLabel: "Hashtag", valuePrefix: "#", valuePostfix: ""},
        {name: "Word", value: "word", valueLabel: "Word", valuePrefix: QUOTE, valuePostfix: QUOTE},
      ]
    },
    {
      name: "Facebook",
      value: "facebook",
      valueTypes: [
        {name: "Page", value: "page", valueLabel: ID, valuePrefix: "", valuePostfix: ""},
        {name: "Group", value: "group", valueLabel: ID, valuePrefix: "", valuePostfix: ""},
      ]
    },
    {
      name: "Meetup",
      value: "meetup",
      valueTypes: [
        {name: "Location", value: "location", valueLabel: "Name", valuePrefix: QUOTE, valuePostfix: QUOTE},
      ]
    },
    {
      name: "Reddit",
      value: "reddit",
      valueTypes: [
        {name: "Forum", value: "forum", valueLabel: ID, valuePrefix: "r/", valuePostfix: ""},
      ]
    },
    {
      name: "News",
      value: "news",
      valueTypes: [
        {name: "rss", value: "rss", valueLabel: "URL", valuePrefix: "", valuePostfix: ""},
      ]
    },
  ];

  const getSelectedPlatform = () => {
    let selectedPlatformIndex = platforms.map(platform => platform.value).indexOf(platform);
    return platforms[selectedPlatformIndex] || {valueTypes: []}
  };

  const getSelectedValueType = () => {
    let selectedPlatformValueTypes = getSelectedPlatform(platform).valueTypes;
    let selectedValueTypeIndex = selectedPlatformValueTypes.map(valueType => valueType.value).indexOf(valueType);

    return selectedPlatformValueTypes[selectedValueTypeIndex] || {valueLabel: "ID", valuePrefix: "", valuePostfix: ""} // TODO - Default label?
  };


  // TODO - Remove inputProps?
  let details =
    <Grid container>
      <Grid item xs={12} sm={4}>
        <FormControl className={classes.selector} fullWidth>
          <InputLabel htmlFor="platform">Platform</InputLabel>
          <Select
            value={platform}
            onChange={handlePlatformChange}
            inputProps={{
              name: 'platform',
              id: 'platform',
            }}
          >
            {platforms.map((platform, index) =>
              <MenuItem
                key={index}
                value={platform.value}
              >
                {platform.name}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>

        <FormControl className={classes.selector} fullWidth>
          <InputLabel htmlFor="valueType">Type</InputLabel>
          <Select
            value={valueType}
            onChange={handleValueTypeChange}
            inputProps={{
              name: 'valueType',
              id: 'valueType',
            }}
          >
            {(getSelectedPlatform(platform)).valueTypes.map((valueType, index) =>
              <MenuItem
                key={index}
                value={valueType.value}
              >
                {valueType.name}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label={getSelectedValueType().valueLabel}
          value={value}
          onChange={handleValueChange}
          className={classes.textField} fullWidth
        />
      </Grid>
    </Grid>;


  // TODO - Platform Icon
  // TODO - Link to source
  return (
    <ExpansionPanel defaultExpanded={value === ""}>

      <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
        <div className={classes.column}>
          <Typography className={classes.heading}>{getSelectedPlatform().name}</Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>{getSelectedValueType().name}</Typography>
        </div>
        <div className={classes.column}>
          <Typography
            className={classes.secondaryHeading}>{getSelectedValueType().valuePrefix + value + getSelectedValueType().valuePostfix}</Typography>
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

Source.propTypes = {
  id: PropTypes.number,
  platform: PropTypes.string,
  valueType: PropTypes.string,
  value: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleDelete: PropTypes.func,
  submitButtonText: PropTypes.string
}

Source.defaultProps = {
  id: 0,
  platform: "",
  valueType: "",
  value: "",
  handleSubmit: () => {
  },
  handleDelete: () => {
  },
  submitButtonText: "Save"
}

export default compose(
  withStyles(styles),
  withState('id', 'updateId', props => props.id),
  withState('platform', 'updatePlatform', props => props.platform),
  withState('valueType', 'updateValueType', props => props.valueType),
  withState('value', 'updateValue', props => props.value),
  withHandlers({
    handlePlatformChange: props => event => {
      props.updatePlatform(event.target.value)
      props.updateValue("")
    },
    handleValueTypeChange: props => event => {
      props.updateValueType(event.target.value)
      props.updateValue("")
    },
    handleValueChange: props => event => {
      props.updateValue(event.target.value)
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.handleSubmit({
        id: props.id,
        platform: props.platform,
        valueType: props.valueType,
        value: props.value
      })
    },
    handleDelete: props => event => {
      event.preventDefault();
      props.handleDelete({
        id: props.id,
        platform: props.platform,
        valueType: props.valueType,
        value: props.value
      })
    },
  }),
)(Source)
