import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";
import Source from "./Source";
import Fab from "@material-ui/core/Fab/Fab";
import Icon from "@material-ui/core/Icon/Icon";

const styles = (theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});


class Sources extends React.Component {

  state = {
    showAdd: false
  };


  render() {
    const {classes, sources, handleSaveSource, handleAddSource, handleDeleteSource} = this.props

    let sourceMap = (source) =>
      <Source
        key={source.id}
        id={source.id}
        platform={source.platform}
        valueType={source.valueType}
        value={source.value}
        handleSubmit={handleSaveSource}
        handleDelete={handleDeleteSource}
      />;

    let getSourceItems = (showAdd) => {
      if (showAdd) {
        return <div>
          {sources.map(sourceMap)}
          <Source
            handleSubmit={handleAddSource}
            handleDelete={() => this.setState({showAdd: false})}
            submitButtonText={"Add"}
          />
        </div>
      }
      else {
        return <div>{sources.map(sourceMap)}</div>
      }
    };


    return <div>
      {getSourceItems(this.state.showAdd)}
      <Fab color="primary" className={classes.fab} onClick={() => this.setState({showAdd: true})}>
        <Icon>add</Icon>
      </Fab>
    </div>


  }
}

Sources.propTypes = {
  sources: PropTypes.array,
  handleAddSource: PropTypes.func,
  handleSaveSource: PropTypes.func,
  handleDeleteSource: PropTypes.func,
};

Sources.defaultProps = {
  sources: [],
  handleAddSource: () => {
  },
  handleSaveSource: () => {
  },
  handleDeleteSource: () => {
  },
};

export default withStyles(styles) (Sources)
