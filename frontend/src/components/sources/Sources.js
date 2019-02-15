import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Sources = ({classes, value}) =>{
  return <div className={classes.wrapper}>{value}</div>
};

Sources.propTypes = {
  value: PropTypes.number
};

Sources.defaultProps = {
  value: 62
};

export default withStyles(styles) (Sources)
