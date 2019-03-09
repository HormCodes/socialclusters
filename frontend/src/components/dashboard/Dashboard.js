import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Dashboard = ({classes, value}) =>{
  //return <PostsToolbar numSelected={0} filterWithTopic={false} isMenuOpened={false}/>
  return <div className={classes.wrapper}>{32}</div>
};


export default withStyles(styles) (Dashboard)
