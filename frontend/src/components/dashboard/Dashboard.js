import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Dashboard = ({classes, value}) =>{
  return <div className={classes.wrapper}>{value}</div>
};

Dashboard.propTypes = {
  value: PropTypes.number
};

Dashboard.defaultProps = {
  value: 42
};

export default withStyles(styles) (Dashboard)
