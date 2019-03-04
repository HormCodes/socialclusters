import React from "react";
import TableHead from "./Posts";
import PropTypes from "prop-types";

import Tooltip from '@material-ui/core/Tooltip';

import TableSortLabel from '@material-ui/core/TableSortLabel';

import TableCell from '@material-ui/core/TableCell';

import Checkbox from '@material-ui/core/Checkbox';

import TableRow from '@material-ui/core/TableRow';

const rows = [
  {id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)'},
  {id: 'calories', numeric: true, disablePadding: false, label: 'Calories'},
  {id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)'},
  {id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)'},
  {id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)'},
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
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
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead
