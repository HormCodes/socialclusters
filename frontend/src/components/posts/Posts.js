import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import {lighten} from "@material-ui/core/styles/colorManipulator";
import PostsToolbar from "./PostsToolbar";
import PostsTableHead from "./PostsTableHead";
import PostsTableBody from "./PostsTableBody";


const rows = [
  {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
  {id: 'platform', numeric: false, disablePadding: false, label: 'Platform'},
  {id: 'author', numeric: false, disablePadding: false, label: 'Author'},
  {id: 'text', numeric: false, disablePadding: true, label: 'Text'},
  {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
];


const styles = theme => ({
  root: {
    width: '100%',

    paddingRight: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  inline: {
    display: 'inline',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {},
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class Posts extends React.Component {

  API_URL = "http://localhost:8080"; // TODO - Constants
  rowsPerPageOptions = [5, 10, 20];

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
  }

  handleFilterTopicChange = event => {
    this.setState({
      filterWithTopic: event.target.checked
    });

    this.fetchPosts(this.state.rowsPerPage, this.state.page, event.target.checked)
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
      this.setState(state => ({selected: state.twitter.map(n => n._id)}));
      return;
    }
    this.setState({selected: []});
  };

  showFilterMenu(event) {
    this.setState({anchorEl: event.currentTarget});
  }

  handleCloseFilterMenu() {
    this.setState({anchorEl: null});
  }


  handlePageChange = (event, page) => {
    this.setState({page})
    this.fetchPosts(this.state.rowsPerPage, page)

  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
    this.fetchPosts(event.target.value, this.state.page)

  };

  handleDeletePosts() {
    let promises = this.state.selected.map(selectedPostId => axios.delete(`${this.API_URL}/contents/twitter/${selectedPostId}`));

    Promise.all(promises)
      .then(() => {
        this.setState({selected: []})
        this.fetchPosts()
      })
      .catch(error => console.error(error))
  }


  componentDidMount() {
    this.fetchPosts(this.state.rowsPerPage, this.state.page)
  }


  fetchPosts(size, page, filterWithTopic = this.state.filterWithTopic) {
    axios.get(`${this.API_URL}/contents/twitter/`, {
      params: {
        withoutTopic: filterWithTopic,
        size: size,
        page: page
      }
    })
      .then(response => {
        this.setState({
          page: response.data.pageable.pageNumber,
          dataLength: response.data.totalElements,
          rowsPerPage: response.data.size, // TODO
          twitter: response.data.content,
        })
      })
      .catch(error => console.log(error))
  }


  render() {
    const {classes, topics} = this.props;


    return (

      <Paper style={{maxHeight: '100vh', overflow: 'auto'}}>
        <PostsToolbar numSelected={this.state.selected.length} isMenuOpened={this.state.anchorEl}/>


        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <PostsTableHead numSelected={this.state.selected.length} rowCount={this.state.twitter.length} rows={rows}/>
            <PostsTableBody twitter={this.state.twitter} selected={this.state.selected} topics={topics}/>
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
      </Paper>)
  }

};


export default withStyles(styles)(Posts)
