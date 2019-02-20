import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";

const styles = theme => ({
  textField: {
    paddingRight: 8
  },
  button: {
    margin: theme.spacing.unit,
  },
})

const Topic = ({classes, name, id}) => {

  const getTextFieldGridItem = (label, id, value) => (
    <Grid item xs={12} sm={6}>
      <TextField id={id} label={label} value={value} className={classes.textField} fullWidth/>
    </Grid>
  )

  return (
    <div>
      <form autoComplete="off">
        <Grid container justify="flex-end"
              alignItems="flex-end">
          {getTextFieldGridItem("Name", "name", name)}
          {getTextFieldGridItem("ID", "id", id)}
          <Grid item ><Button className={classes.button} variant="contained" color={"primary"}>Save</Button> </Grid>
          <Grid item> <Button className={classes.button} variant="contained" >Delete</Button> </Grid>
        </Grid>


      </form>
    </div>
  )

}

Topic.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string
};

Topic.defaultProps = {
  name: "Unknown",
  id: "unknown"
}

export default withStyles(styles)(Topic)
