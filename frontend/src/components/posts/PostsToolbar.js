import {lighten} from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import {ListItemText, withStyles} from "@material-ui/core";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";

import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import * as PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {compose, withHandlers, withState} from "recompose";

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let PostsToolbar = props => {

  const {
    title,
    topics,
    numSelected,
    classes,
    anchorEl,
    filterWithTopic,
    filterWithoutTopic,
    handleDeletePosts,
    handleCloseMenu,
    handleOpenMenu,
    handleFilterTopicSwitch,
  } = props;

  let filterButton =
    <div>
      <Tooltip title="Filter list">
        <IconButton aria-label="Filter list" onClick={handleOpenMenu}>
          <FilterListIcon/>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          handleFilterTopicSwitch()
        }}>
          <Checkbox checked={filterWithoutTopic}/>
          <ListItemText>Without Topic</ListItemText>
        </MenuItem>
        {topics.map((topic, index) => <MenuItem key={index} onClick={() => {
          handleFilterTopicSwitch(topic.textId)
        }}>
          <Checkbox checked={!!filterWithTopic[topic.textId]}/>
          <ListItemText>{topic.name}</ListItemText>
        </MenuItem>)}
      </Menu>
    </div>;


  let deleteButton =
    <Tooltip title="Delete">
      <IconButton aria-label="Delete" onClick={handleDeletePosts}>
        <DeleteIcon/>
      </IconButton>
    </Tooltip>;


  let numSelectedTitle =
    <Typography color="inherit" variant="subtitle1">
      {numSelected} selected
    </Typography>;


  let postsTitle =
    <Typography variant="h6" id="tableTitle">
      {title}
    </Typography>;


  return (
    <Toolbar className={classNames(classes.root, {[classes.highlight]: numSelected > 0,})}>
      <div className={classes.title}>
        {numSelected > 0 ? (numSelectedTitle) : (postsTitle)}
      </div>
      <div className={classes.spacer}/>
      <div className={classes.actions}>
        {numSelected > 0 ? (deleteButton) : (filterButton)}
      </div>
    </Toolbar>
  )
}

PostsToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  filterWithTopic: PropTypes.object.isRequired,
  filterWithoutTopic: PropTypes.bool.isRequired,
  handleFilterTopicSwitch: PropTypes.func.isRequired,
  handleDeletePosts: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};


PostsToolbar.defaultProps = {
  numSelected: 0,
  isMenuOpened: false,
  filterWithTopic: {},
  filterWithoutTopic: false,
  handleFilterTopicSwitch: () => {
  },
  handleDeletePosts: () => {
  },
  title: "Twitter" // TODO - Add as attr
};


export default compose(
  withStyles(toolbarStyles),
  withState('anchorEl', 'updateAnchorEl', null),
  withHandlers({
    handleOpenMenu: props => event => {
      props.updateAnchorEl(event.currentTarget)
    },
    handleCloseMenu: props => event => {
      props.updateAnchorEl(null)
    }
  })
)(PostsToolbar);
