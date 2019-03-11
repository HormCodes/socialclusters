import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import * as PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";

let PostsTableBody = props => {
  const {twitter, selected, topics, handleSelect, columns} = props


  const getTopicName = id => {
    let safeTopics = topics || [];
    return (safeTopics[safeTopics.map(topic => topic.textId).indexOf(id)] || {name: id}).name;
  };

  const getTopics = (topics) => (topics || []).map(topic => getTopicName(topic)).join(', ');

  const getText = (text) => (text || '').substr(0, 20) + '...';

  const isSelected = id => selected.indexOf(id) !== -1;

  const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
  }

  // TODO - Multi Data Source
  return <TableBody>
    {twitter.map((post, index) => <TableRow
      key={index}
      hover
      role="checkbox"
      aria-checked={false}
      tabIndex={-1}
      selected={false}
      onClick={event => handleSelect(event, post._id)}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected(post._id)}/>
      </TableCell>

      {columns.map((column, index) => <TableCell
        key={index}>{(column.valueFormatter(getNestedObject(post, column.valuePath)) || '').toString()}</TableCell>)}
    </TableRow>)}
  </TableBody>;
}

PostsTableBody.propTypes = {
  twitter: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

PostsTableBody.defaultProps = {
  twitter: [],
  selected: [],
  topics: [],
  columns: [],
  handleSelect: () => {
  },
}


export default PostsTableBody
