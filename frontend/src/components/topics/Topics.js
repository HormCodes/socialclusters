import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Topics = ({classes, value}) =>{
  return <div className={classes.wrapper}>{value}</div>
};

Topics.propTypes = {
  value: PropTypes.number
};

Topics.defaultProps = {
  value: 72
};

export default withStyles(styles) (Topics)
