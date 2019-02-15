import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Settings = ({classes, value}) =>{
  return <div className={classes.wrapper}>{value}</div>
};

Settings.propTypes = {
  value: PropTypes.number
};

Settings.defaultProps = {
  value: 99
};

export default withStyles(styles) (Settings)
