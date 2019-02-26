import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Fab from "@material-ui/core/Fab/Fab";
import Icon from "@material-ui/core/Icon/Icon";
import PropTypes from "prop-types";
import Topic from "./Topic";

const styles = (theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  column: {
    flexBasis: '33.33%',
  },
  textField: {
    paddingRight: 8
  },
})

class Topics extends React.Component {
  state = {
    showAdd: false
  }


  render() {
    const {classes, topics, handleSaveTopic} = this.props

    let layout = topics =>
      <div>
        {topics.map((topic) => <Topic key={topic.id} id={topic.id} textId={topic.textId} name={topic.name}
                                      handleSave={handleSaveTopic}/>)}
      <Fab color="primary" className={classes.fab} onClick={() => this.setState({showAdd: true})}>
        <Icon>add</Icon>
      </Fab>

    </div>


    if (this.state.showAdd) {
      return layout(topics.concat([{id: "", name: ""}]))
    } else {
      return layout(topics)
    }
  }
};

Topics.propTypes = {
  topics: PropTypes.array,
  handleSaveTopic: PropTypes.func,
};

Topics.defaultProps = {
  topics: [],
  handleSaveTopic: () => {
  }
};

export default withStyles(styles)(Topics)
