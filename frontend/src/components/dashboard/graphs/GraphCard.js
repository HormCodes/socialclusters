import {Card} from "@material-ui/core";
import React from "react";
import * as PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({});

const GraphCard = ({
                     handleButtonClick,
                     title,
                     children,
                   }) =>
  <Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>;

GraphCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

GraphCard.defaultProps = {
  title: "",
  children: <div/>
};

export default withStyles(styles)(GraphCard)
