import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
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
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {id: 'name', numeric: false, disablePadding: true, label: 'Post'},
  {id: 'platform', numeric: true, disablePadding: false, label: 'Platform'},
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

  state = {
    filterWithTopic: true,
    orderBy: "date",
    order: "date",
    twitter: [],
    selected: [],
    numSelected: 0,
    rowsPerPage: 0,
    page: 0,
  }

  handleFilterTopicChange = event => {
    this.setState({
      filterWithTopic: event.target.checked
    });
  }

  componentDidMount() {
    this.fetchPosts()
  }


  fetchPosts() {
    axios.get(this.API_URL + "/contents/twitter/?withoutTopic=" + !this.state.filterWithTopic)
      .then(response => {
        this.setState({
          page: response.data.pageable.pageNumber,
          rowsPerPage: 5, // TODO
          twitter: response.data.content
        })
      })
      .catch(error => console.log(error))
  }

  componentDidUpdate() {
    this.fetchPosts()
  }

  render() {
    const {classes, topics} = this.props;

    let getTopicNameForId = (topic) => topics[topics.map(topic => topic.textId).indexOf(topic)].name

    let postToListItem = (post, index) =>
      <div key={index}><ListItem button>

        <div>

        </div>
        <ListItemText primary={post.author.username} secondary={<React.Fragment>
          <Typography component="span" className={classes.inline} color="textPrimary">
            {(new Date(post.timestamp).toUTCString())}
          </Typography>
          {" — " + post.text.substr(0, 100) + "... "}
        </React.Fragment>}/>
        {(post.topics || []).map((topic, index) => <Chip key={index} label={getTopicNameForId(topic)}
                                                         className={classes.chip}/>)}
      </ListItem>
        <Divider/>
      </div>;

    const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.twitter.length - this.state.page * this.state.rowsPerPage);


    return (

      <Paper style={{maxHeight: '100vh', overflow: 'auto'}}>
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
              {stableSort(this.state.twitter, getSorting(this.state.order, this.state.orderBy))
                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                .map(n => {
                  const isSelected = false;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected}/>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.text}
                      </TableCell>
                      <TableCell align="right">{"Twitter"}</TableCell>
                      <TableCell align="right">{n.timestamp}</TableCell>
                      <TableCell align="right">{n.author.username}</TableCell>
                      <TableCell align="right">{n.topics[0]}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{height: 49 * emptyRows}}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.twitter.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
        />
      </Paper>)
  }

};

Posts.propTypes = {
  posts: PropTypes.array,
};

Posts.defaultProps = {
  posts: [],
};

export default withStyles(styles)(Posts)
