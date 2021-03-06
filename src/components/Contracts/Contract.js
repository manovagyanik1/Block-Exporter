import React, { Component } from 'react';
import ContractRow from './ContractRow';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './styles.css';

class Contract extends Component {
	constructor(e) {
		super(e);
		this.state = {
			data: !!this.props.contracts ? this.props.contracts : [],
			temp_data: !!this.props.contracts ? this.props.contracts : [],
			contract : '',
			currentPage: 0,
			pageSize: 5,
			pagesCount: 0,
			sortType: 'ASC',
			sortBy: 'object_id'
		};
		this.gridHeight = 31;
		//pagination set page length
		this.onContractEnter = this.onContractEnter.bind(this);
	}

	componentDidMount() {
		this.findData();
		if(this.props.id !== '') {
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
		}
	}

	componentDidUpdate(prevProps) {
		if(this.props.contracts !== prevProps.contracts) {
			this.setState({data: this.props.contracts, temp_data: this.props.contracts});
			this.refreshPagination(this.props.contracts);
		}
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also searches for the search String in the newly fetched data.*/
		axios.get(`api/contracts?sort=${colType}&direction=${sortType}`, {
		}).then(response => {
			const sortedContracts = response.data;
			this.findContract(this.state.contract, sortedContracts);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	findContract(contractName, data) {
		let temp_data = [];
		//if the data name matches contract name, add to data
		for (let contract in data) {
			if (data[contract].name.indexOf(contractName) >= 0 || data[contract].object_id.indexOf(contractName) >= 0) 
				temp_data.push(data[contract]);
		}
		// if (temp_data.length <= 0)
		// 	temp_data = data;
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	findData() {
		this.setState({pagesCount: this.props.contracts ? Math.ceil(this.props.contracts.length / this.state.pageSize) : 0, currentPage: 0 });
	}

	onContractEnter(e) {
		e.preventDefault();
		this.setState({ contract: e.target.value });
		this.findContract(e.target.value, this.state.data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index });
	}

	render() {
		const { temp_data, contract, currentPage, pageSize } = this.state;
		
		return(

			<div>
				{!!this.props.history ? // page
					<div className="container pt-0 pb-5 mt-5">
						<div className="pagination-wrapper">
							<InputGroup>
								<Input type="text" value={contract} onChange={this.onContractEnter.bind(this)} placeholder="Contract" />
							</InputGroup>
							<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
						</div>
						<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-0`}>
							<span className="fa fa-file-signature">&nbsp;</span>Browse Smart Contracts</h1>
						<table className="table">
							<thead className={`${styles['clickable']} ${styles['smart-contracts-header']} ${styles['header-contrast-text']}`}>
								<tr>
									<th onClick={this.sortByColumn.bind(this, 'name')}>Contract Name</th>
									<th onClick={this.sortByColumn.bind(this, 'object_id')}>ID</th>
									<th onClick={this.sortByColumn.bind(this, 'balances')}>Balance</th>
								</tr>
							</thead>
							<tbody>
								{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((contract, i) =>
									<ContractRow detail={contract} key={i}/>
								)}
							</tbody>
						</table>{temp_data.length===0 && <div> No Contracts Found </div>}
					</div>
					:// widget
					<div className="container pt-0 pb-5 mt-0">
						<div className="pagination-wrapper">
							<InputGroup>
								<Input type="text" value={contract} onChange={this.onContractEnter.bind(this)} placeholder="Contract" />
							</InputGroup>
							<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
						</div>
						
						<table className="table">
							<thead className={`${styles['clickable']} ${styles['smart-contracts-header']} ${styles['header-contrast-text']}`}>
								<tr>
									<th onClick={this.sortByColumn.bind(this, 'name')}>Contract Name</th>
									<th onClick={this.sortByColumn.bind(this, 'object_id')}>ID</th>
									<th onClick={this.sortByColumn.bind(this, 'balances')}>Balance</th>
								</tr>
							</thead>
							<tbody>
								{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((contract, i) =>
									<ContractRow detail={contract} key={i}/>
								)}
							</tbody>
						</table>{temp_data.length===0 && <div> No Contracts Found </div>}
					</div>}
			</div>
		);
	}	
}

Contract.defaultProps = {
	id: '',
};

const mapStateToProps = (state) => ({
	contracts: state.contracts.contractList
});

export default connect(mapStateToProps)(Contract);