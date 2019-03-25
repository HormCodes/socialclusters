import React from 'react';
import Chart from 'react-google-charts';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import SuggestTopicCard from "./actions/SuggestTopicCard";
import WithoutTopicCard from "./actions/WithoutTopicCard";
import WithSuggestedTopicCard from "./actions/WithSuggestedTopicCard";
import {Card, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PostsByTopicGraph from "./graphs/PostsByTopicGraph";
import PostsGraph from "./graphs/PostsGraph";

const styles = {
  wrapper: {
    color: 'red',
  },
}

const Dashboard = ({classes, value, topics, countsByDay}) => {

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <WithoutTopicCard/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <WithSuggestedTopicCard/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <SuggestTopicCard/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <PostsByTopicGraph countsByDay={countsByDay} topics={topics}/>

        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Posts by Platform
            </Typography>
            <Chart
              chartType="Bar"
              loader={<div>Loading Chart</div>}
              data={[
                ['Year', 'Sales', 'Expenses', 'Profit'],
                ['2014', 1000, 400, 200],
                ['2015', 1170, 460, 250],
                ['2016', 660, 1120, 300],
                ['2017', 1030, 540, 350],
              ]}
              options={{
                // Material design options
                //chart: {
                //  title: 'Company Performance',
                //  subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                //},
              }}
              // For tests
              rootProps={{'data-testid': '2'}}
            /></CardContent>
          </Card>

        </Grid>
        <Grid item xs={12} sm={4}>
          <PostsGraph countsByDay={countsByDay}/>

        </Grid>

      </Grid>

    </div>
  )
};


export default withStyles(styles)(Dashboard)
