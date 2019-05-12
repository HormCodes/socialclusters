import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',

    height: 300,
  },
});

const Authors = ({authors, platformTitle, classes}) =>
  <GraphCard
    title={platformTitle}
  >
    <List className={classes.root}>
      {authors.length === 0 ?
        <p className={classes.root}>No posts from this platform...</p> : authors.map((author, index) =>
          <ListItem key={index}>
            <ListItemText
              primary={author.author}
              secondary={author.count}
            />

          </ListItem>,
        )}
    </List>


  </GraphCard>;

Authors.propTypes = {
  platform: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
};

Authors.defaultProps = {
  platform: "",
  authors: [],
};

export default withStyles(styles)(Authors)
