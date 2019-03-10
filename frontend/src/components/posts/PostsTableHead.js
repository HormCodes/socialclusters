import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import * as PropTypes from "prop-types";


let PostsTableHead = props => {
  const {numSelected, rowCount, handleSelectAllClick, columns, order, orderBy} = props;


  let columnToHtml = row => (
    <TableCell
      key={row.id}
      align={row.numeric ? 'right' : 'left'}
      padding={row.disablePadding ? 'none' : 'default'}
      sortDirection={orderBy === row.id ? order : false}
    >
      <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
        <TableSortLabel active={orderBy === row.id} direction={order}>
          {row.label}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );

  return (
    <TableHead>
      <TableRow>

        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={handleSelectAllClick}
          />
        </TableCell>

        {columns.map(columnToHtml)}

      </TableRow>
    </TableHead>
  );
};

PostsTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  handleSelectAllClick: PropTypes.func.isRequired,
};

PostsTableHead.defaultProps = {
  numSelected: 0,
  rowCount: 5,
  columns: [],
  order: 'asc', // TODO - Asc or Desc?
  orderBy: 'timestamp',
  handleSelectAllClick: () => {
  },
};

export default (PostsTableHead)
