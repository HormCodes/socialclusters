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
  const {numSelected, classes, isMenuOpened, filterWithTopic, handleClose, handleFilterTopicChange, handleDeletePosts, handleCloseFilterMenu, showFilterMenu} = props;

  return (
    <Toolbar className={classNames(classes.root, {
      [classes.highlight]: numSelected > 0,
    })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Posts
          </Typography>
        )}
      </div>
      <div className={classes.spacer}/>
      <div className={classes.actions}>
        {numSelected > 0 ?
          (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={() => handleDeletePosts()}>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          )
          :
          (<div>

              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list" onClick={event => showFilterMenu(event)}>
                  <FilterListIcon/>
                </IconButton>

              </Tooltip>
              <Menu
                anchorEl={isMenuOpened}
                open={Boolean(isMenuOpened)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleCloseFilterMenu()}>
                  <Checkbox checked={filterWithTopic} onChange={handleFilterTopicChange}/>
                  <ListItemText>Without Topic</ListItemText>
                </MenuItem>
              </Menu>
            </div>

          )}
      </div>
    </Toolbar>)
}

PostsToolbar.propTypes = {
  numSelected: PropTypes.number,
  isMenuOpened: PropTypes.bool,
  filterWithTopic: PropTypes.bool,

}

export default withStyles(toolbarStyles)(PostsToolbar);
