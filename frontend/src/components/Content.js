import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import {withStyles} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class Content extends React.Component {
  render() {
    const {classes} = this.props;

    return (<div>
        <CssBaseline/>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            Lorem ipsum dolor sit amet...
          </Typography>
        </main>
      </div>
      )
  }
}

export default withStyles(styles)(Content);
