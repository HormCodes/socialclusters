import {Card} from "@material-ui/core";
import React from "react";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";
import moment from "moment";


const styles = theme => ({});

const InfoCard = ({
                    numberOfWithoutTopic,
                    numberOfWithSuggestedTopic,
                    handleSuggest,
                    handleDownload,
                    currentTopicModelTrainingTimestamp,
                    isTopicModelInTraining,
                    handleTraining
                  }) =>
  <Card>
    <CardContent style={{height: 235}}>
      <Typography gutterBottom variant="h5" component="h2">
        General Info
      </Typography>
      <Typography component="p">
        {numberOfWithoutTopic} posts haven't topic.
      </Typography>
      <Typography component="p">
        {numberOfWithSuggestedTopic} posts have suggested topic.
      </Typography>
      <Typography component="p">
        Current Topic Analysis model was
        trained {moment(currentTopicModelTrainingTimestamp).fromNow()}. {isTopicModelInTraining ? "New model is in training." : ""}
      </Typography>

    </CardContent>
    <CardActions>
      <Button size="small" color="primary" onClick={handleDownload}>
        Download Data
      </Button>
      <Button size="small" color="primary" onClick={handleSuggest}>
        Suggest Topics
      </Button>
      {!isTopicModelInTraining ? <Button size="small" color="primary" onClick={handleTraining}>
        Train Topic Analysis Model
      </Button> : <div/>}
    </CardActions>
  </Card>;

InfoCard.propTypes = {
  // TODO
};

InfoCard.defaultProps = {
  // TODO
};

export default withStyles(styles)(InfoCard)
