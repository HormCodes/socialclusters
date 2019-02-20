import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import List from "@material-ui/core/List/List";
import Fab from "@material-ui/core/Fab/Fab";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Divider from "@material-ui/core/Divider/Divider";
import Icon from "@material-ui/core/Icon/Icon";

const styles = (theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
})

const TopicList = ({topics, classes}) => {
  let topicToListItem = topic =>
    <Link to={'topics/' + topic.id} style={{textDecoration: 'none'}}><ListItem button>
      <ListItemText primary={topic.name} secondary={topic.id}/>
    </ListItem>
      <Divider/>
    </Link>;

  return <div>
    <List>
      {topics.map(topicToListItem)}
    </List>
    <Fab color="primary" className={classes.fab}>
      <Icon>add</Icon>
    </Fab>
  </div>

}

TopicList.propTypes = {
  topics: PropTypes.array
};

TopicList.defaultProps = {
  topics: [
    {
      "id": "traffic",
      "name": "Doprava"
    },
    {
      "id": "culture",
      "name": "Kultura"
    },
    {
      "id": "events",
      "name": "Akce"
    },
    {
      "id": "news",
      "name": "Zprávy"
    },
    {
      "id": "tourism",
      "name": "Turismus"
    },
    {
      "id": "life",
      "name": "Život v Brně"
    },
    {
      "id": "work",
      "name": "Práce"
    },
    {
      "id": "places",
      "name": "Místa"
    },
    {
      "id": "sport",
      "name": "Sport"
    }
  ]
};

export default withStyles(styles) (TopicList)
