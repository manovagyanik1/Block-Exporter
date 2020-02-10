import React, { Component } from 'react';
import {Table, TableContainer, TablePagination, InputAdornment, Input} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CustomTableHeader from './CustomTableHeader';
import CustomTableBody from './CustomTableBody';
import GeneralApi from '../../../api/GeneralApi';
import styles from './styles.css';

const muiStyle = {
	root: {
		backgroundColor: 'white',
	},
};

class CustomTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText : '',
			currentPage: 0,
			rowsPerPage: 5,
			sortType: 'desc',
			sortBy: '',
			filteredData: ''
			
		};

		this.containerClass = this.props.widget ? 'table-border-sm' : 'table-border';
		this.tableHeaderClass = this.props.widget ? 'table-header-container-sm' : 'table-header-container';
	}

	changePage = (e, index) => {
		e.preventDefault();
		this.setState({ currentPage: index });
	}
  //processes both table search and table filter
  searchTable = e => {
  	e.preventDefault();
  	this.setState({ searchText: e.target.value });
  	this.onSearchData(e.target.value, this.props.data);
  }

	onSearchData = (value, data) => {
		if(value.includes('1.2.'))
			this.searchDataById(value, data);
		else
			this.searchDataByName(value, data);
	}

	searchDataByName(name, data) {
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(name);
		});
		this.setState({ filteredData: temp_data, currentPage: 0 });//This needs to be fixed
	}

	searchDataById = (id, data) =>{
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_id.includes(id);
		  });
		this.setState({ filteredData: temp_data, currentPage: 0 });//This needs to be fixed
	}
  
	changeRowsPerPage = event => {
		this.setState({rowsPerPage: event.target.value});
		this.changePage(event, 0);
	};

	 sortByColumn = (colType) => {
	 	let sortType = this.state.sortType;
	 	if(this.state.sortBy === colType)
	 	{
	 		sortType === 'desc' ? sortType='asc': sortType='desc';
	 	}
		 this.setState({sortType:sortType, sortBy:colType});
		 
	 	GeneralApi.sort(this.props.tableType, colType, sortType).then((sortedData) => {
	 		this.onSearchData(this.state.searchText, sortedData.data);
		 });
	 }
  
	 render() {
	 	const {currentPage, rowsPerPage, filteredData, sortBy, sortType, searchText} = this.state;
	 	const {data, tableType, headerLabel, headerIcon, widget, classes} = this.props;
		 //If the table sort or search is active display filtered data otherwise display pure data
		 const tableData = filteredData || searchText ? filteredData : data;
  	return (
  		<div className={`${styles[this.containerClass]}`}>
  			<TableContainer className={`${styles['table-container']}`}>
					 <div className={`${styles[this.tableHeaderClass]}`}>
					 {widget ? null :
						 <span className={`${styles['table-header-text']}`}><span className={headerIcon}/>{headerLabel}</span>
	 					}
	 					<Input
						 className={`${classes.root} ${styles['table-header-search']}`}
	 						id="standard-adornment-password"
	 						type="search"
	 						label="Search"
	 						value={searchText}
	 						onChange={this.searchTable}
	 						endAdornment={
	 							<InputAdornment position="end">
	 								<SearchIcon/>
	 							</InputAdornment>
	 						}
  					/>
	 				</div>
  				<Table stickyHeader>
  					<CustomTableHeader sortByColumn={this.sortByColumn} sortBy={sortBy} sortType={sortType}/>
	 					<CustomTableBody tableData={tableData} currentPage={currentPage} rowsPerPage={rowsPerPage} tableType={tableType}/>
  				</Table>
  			</TableContainer>
  			<TablePagination
  				rowsPerPageOptions={[5, 10, 25]}
  				component="div"
  				count={tableData.length}
  				rowsPerPage={rowsPerPage}
  				page={currentPage}
  				onChangePage={this.changePage}
  				onChangeRowsPerPage={this.changeRowsPerPage}
  			/>
  		</div>
  	);
	 }
}
export default withStyles(muiStyle)(CustomTable);