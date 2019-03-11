import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import PostsToolbar from "./PostsToolbar";
import PostsTableHead from "./PostsTableHead";
import PostsTableBody from "./PostsTableBody";
import * as PropTypes from "prop-types";

const styles = () => ({
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {},

});

class PlatformPostTable extends React.Component {


  rowsPerPageOptions = [5, 10, 20];

  deletePost = this.props.deletePost;
  getPostsAsPage = this.props.getPostsAsPage;

  state = {
    filterWithTopic: false,
    orderBy: "timestamp",
    order: "asc",
    twitter: [],
    selected: [],
    rowsPerPage: this.rowsPerPageOptions[0],
    dataLength: 0,
    page: 0,
    anchorEl: null,
  };


  handleFilterTopicSwitch = () => {
    this.setState(prevState => {
      this.fetchPosts(this.state.rowsPerPage, this.state.page, !prevState.filterWithTopic); // TODO - Refactor
      return {
        filterWithTopic: !prevState.filterWithTopic
      }
    });


  };

  handleSelectClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({selected: newSelected});
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({selected: state.twitter.map(n => n._id)})); // TODO - Multi Data Source
      return;
    }
    this.setState({selected: []});
  };


  handlePageChange = (event, page) => {
    this.setState({page})
    this.fetchPosts(this.state.rowsPerPage, page) // TODO - Refactor

  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
    this.fetchPosts(event.target.value, this.state.page) // TODO - Refactor

  };

  handleDeletePosts() {
    let promises = this.state.selected.map(selectedPostId => this.deletePost(selectedPostId));

    Promise.all(promises)
      .then(() => {
        this.setState({selected: []});
        this.fetchPosts()
      })
      .catch(error => console.error(error))
  }


  componentDidMount() {
    this.fetchPosts(this.state.rowsPerPage, this.state.page)
  }


  fetchPosts(size, page, filterWithTopic = this.state.filterWithTopic) {
    let applyResponseToState = response => {
      this.setState({
        page: response.data.number,
        dataLength: response.data.totalElements,
        rowsPerPage: response.data.size, // TODO
        twitter: response.data.content,
      })
    };


    this.getPostsAsPage(size, page, filterWithTopic)
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }


  render() {
    const {classes, topics, columns, platformName, handleOpenPost} = this.props;


    return (

      <Paper style={{maxHeight: '100vh', overflow: 'auto', margin: '10px'}}>
        <PostsToolbar
          title={platformName}
          numSelected={this.state.selected.length}
          handleDeletePosts={this.handleDeletePosts.bind(this)}
          handleFilterTopicSwitch={this.handleFilterTopicSwitch}
          filterWithTopic={this.state.filterWithTopic}
        />


        <div className={classes.tableWrapper}>

          <Table className={classes.table} aria-labelledby="tableTitle">
            <PostsTableHead
              numSelected={this.state.selected.length}
              rowCount={this.state.twitter.length}
              columns={columns}
              handleSelectAllClick={this.handleSelectAllClick}
            />
            <PostsTableBody
              twitter={this.state.twitter}
              selected={this.state.selected}
              topics={topics}
              handleOpenPost={handleOpenPost}
              columns={columns}
              handleSelect={this.handleSelectClick}
            />
          </Table>

        </div>

        <TablePagination
          rowsPerPageOptions={this.rowsPerPageOptions}
          component="div"
          count={this.state.dataLength}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handlePageChange}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }

}

PlatformPostTable.propTypes = {
  platformName: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  deletePost: PropTypes.func.isRequired,
  getPostsAsPage: PropTypes.func.isRequired,
};

PlatformPostTable.defaultProps = {
  platformName: "",
  topics: [],
  columns: [],
  deletePost: () => Promise.resolve(),
  getPostsAsPage: () => Promise.resolve(),
}


export default withStyles(styles)(PlatformPostTable)
