import React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from "axios";


const rows = [
  {id: 'platform', numeric: true, disablePadding: false, label: 'Platform'},
  {id: 'text', numeric: false, disablePadding: true, label: 'Text'},
  {id: 'timestamp', numeric: true, disablePadding: false, label: 'Timestamp'},
  {id: 'author', numeric: true, disablePadding: false, label: 'Author'},
  {id: 'topic', numeric: true, disablePadding: false, label: 'Topic'},
];


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
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
    numSelected: 0,
    rowsPerPage: this.rowsPerPageOptions[0],
    dataLength: 0,
    page: 0,
  }

  handleFilterTopicChange = event => {
    this.setState({
      filterWithTopic: event.target.checked
    });
  };


  handlePageChange = (event, page) => {
    this.setState({page})
    this.fetchPosts(this.state.rowsPerPage, page)

  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
    this.fetchPosts(event.target.value, this.state.page)

  };


  componentDidMount() {
    this.fetchPosts(this.state.rowsPerPage, this.state.page)
  }


  fetchPosts(size, page) {
    axios.get(`${this.API_URL}/contents/twitter/`, {
      params: {
        withoutTopic: this.state.filterWithTopic,
        size: size,
        page: page
      }
    })
      .then(response => {
        this.setState({
          page: response.data.pageable.pageNumber,
          dataLength: response.data.totalElements,
          rowsPerPage: 5, // TODO
          twitter: response.data.content,
        })
      })
      .catch(error => console.log(error))
  }


  render() {
    const {classes} = this.props;

    const getTopics = (topics) => (topics || []).join(', ')
    const getText = (text) => (text || '').substr(0, 100) + '...'


    return (<Paper style={{maxHeight: '100vh', overflow: 'auto'}}>
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: this.state.numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {this.state.numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {this.state.numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Posts
            </Typography>
          )}
        </div>
        <div className={classes.spacer}/>
        <div className={classes.actions}>
          {this.state.numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon/>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>


      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={this.state.numSelected > 0 && this.state.numSelected < this.state.twitter.length}
                  checked={this.state.numSelected === this.state.twitter.length}
                />
              </TableCell>
              {rows.map(
                row => (
                  <TableCell
                    key={row.id}
                    align={row.numeric ? 'right' : 'left'}
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={this.state.orderBy === row.id ? this.state.order : false}
                  >
                    <Tooltip
                      title="Sort"
                      placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={this.state.orderBy === row.id}
                        direction={this.state.order}
                      >
                        {row.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                ),
                this,
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.twitter.map((post, index) => <TableRow
              hover
              role="checkbox"
              aria-checked={false}
              tabIndex={-1}
              selected={false}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={false}/>
              </TableCell>
              <TableCell align="right">{"Twitter"}</TableCell>

              <TableCell component="th" scope="row" padding="none">
                {getText(post.text)}
              </TableCell>
              <TableCell align="right">{post.timestamp}</TableCell>
              <TableCell align="right">{post.author.username}</TableCell>
              <TableCell align="right">{getTopics(post.topics)}</TableCell>
            </TableRow>)}
          </TableBody>
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
