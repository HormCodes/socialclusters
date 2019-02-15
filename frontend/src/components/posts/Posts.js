import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Posts = ({classes, value}) =>{
  return <div className={classes.wrapper}>{value}</div>
};

Posts.propTypes = {
  value: PropTypes.number
};

Posts.defaultProps = {
  value: 52
};

export default withStyles(styles) (Posts)
