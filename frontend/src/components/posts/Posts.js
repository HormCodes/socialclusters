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
import {lighten} from "@material-ui/core/styles/colorManipulator";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {ListItemText} from "@material-ui/core";


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

    const getTopicName = id => (topics[topics.map(topic => topic.textId).indexOf(id)] || {name: id}).name;
    const getTopics = (topics) => (topics || []).map(topic => getTopicName(topic)).join(', ');
    const getText = (text) => (text || '').substr(0, 20) + '...';

    const isSelected = id => this.state.selected.indexOf(id) !== -1;


    return (<Paper style={{maxHeight: '100vh', overflow: 'auto'}}>
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: this.state.selected.length > 0,
        })}
      >
        <div className={classes.title}>
          {this.state.selected.length > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {this.state.selected.length} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Posts
            </Typography>
          )}
        </div>
        <div className={classes.spacer}/>
        <div className={classes.actions}>
          {this.state.selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={() => this.handleDeletePosts()}>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          ) : (<div>

            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list" onClick={event => this.showFilterMenu(event)}>
                <FilterListIcon/>
              </IconButton>

            </Tooltip>
              <Menu
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={() => this.handleCloseFilterMenu()}>
                  <Checkbox checked={this.state.filterWithTopic} onChange={this.handleFilterTopicChange}/>
                  <ListItemText>Without Topic</ListItemText>
                </MenuItem>
              </Menu>
            </div>

          )}
        </div>
      </Toolbar>


      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={this.state.selected.length > 0 && this.state.selected.length < this.state.twitter.length}
                  checked={this.state.selected.length === this.state.twitter.length}
                  onChange={this.handleSelectAllClick}
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
              onClick={event => this.handleSelectClick(event, post._id)}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={isSelected(post._id)}/>
              </TableCell>
              <TableCell align="left">{post.timestamp}</TableCell>
              <TableCell align="left">{"Twitter"}</TableCell>

              <TableCell align="left">{post.author.username}</TableCell>
              <TableCell component="th" scope="row" padding="none">
                {getText(post.text)}
              </TableCell>
              <TableCell align="left">{getTopics(post.topics)}</TableCell>
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
