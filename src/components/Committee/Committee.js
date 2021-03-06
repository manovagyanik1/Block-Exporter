import React, { Component, Fragment } from 'react';
import CommitteeRow from './CommitteeRow';
import axios from 'axios';
import styles from './styles.css';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap';
import { connect } from 'react-redux'; 

class Committee extends Component {
	constructor(props) {
		super(props);
		this.state = {topFiveCommittee: [], committeeData: [], searchData: [], committee: '', currentPage: 0, pageSize: 3, pagesCount: 0, sortType: 'ASC', sortBy: 'rank'};
		this.gridHeight = 25;
	}

	componentDidMount() {
		axios.get('/api/committee', {
		}).then(response => {
			this.setState({committeeData: response.data});
			const newState = response.data;
			newState.map( (el, index) => {return el.rank = index+1;});
			newState.map(el => {return el.account_name = this.props.accounts.find(account => account.account_id === el.committee_member_account).account_name;});

			this.setState({searchData: newState, topFiveCommittee: newState.slice(0, 5)});
			this.refreshPagination(response.data);
		}).catch(error => {
			console.log('error', error);
		});

		if(this.props.history ===undefined)
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.committee !== prevState.committee && this.state.committee.length < 1) {
			this.setState({searchData: this.state.committeeData});
			this.refreshPagination(this.state.committeeData);
		}
	}

	refreshPagination(data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onCommitteeEnter(e) {
		e.preventDefault();
		this.setState({committee: e.target.value});
		if(e.target.value.includes('1.5.'))
			this.findAccountById(e.target.value, this.state.committeeData);
		else
			this.findAccountByName(e.target.value, this.state.committeeData);
	}

	findAccountByName(committee, data) {
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(committee);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	findAccountById(committee, data) {
		let temp_data = [];
		temp_data = data.filter(obj => {
			return obj.committee_id === (committee);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	sortSearch(committee, data) {
		if(committee.includes('1.5.'))
			this.findAccountById(committee, data);
		else
			this.findAccountByName(committee, data);
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;

		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the committee data which
		  stores the initial API call made when the component is loaded and committee rank is calculated.
		the committee rank is the appended to the data coming in from the sort API call.*/

		if(colType === 'committee_id') {
			const sortedArray = this.state.searchData.sort((a, b) => {return a.account_name > b.account_name; });
			if(this.state.sortType === 'DESC') {
				this.setState({searchData: sortedArray.reverse(), currentPage: 0});
			}
			else {
				this.setState({searchData: sortedArray, currentPage: 0});
			}
		}
		else {
			axios.get(`api/committee?sort=${colType}&direction=${sortType}`, {
			}).then(response => {
				let sortedcommitteeData = response.data;
				sortedcommitteeData = sortedcommitteeData.map(object => {
					const rankObject = this.state.committeeData.find(el => el.id === object.id);
					return rankObject;
				});
				this.setState({searchData: sortedcommitteeData});
				this.sortSearch(this.state.committee, sortedcommitteeData);
			}).catch(error => {console.log('error fetching committee data', error);});
		}
	}

	sortByColumnSmall(colType) {
		let sortType = this.state.sortType;
		let sortedList = [];
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});

		switch(colType) {
			case 'committee_id':
				sortedList = this.state.topFiveCommittee.sort( (a, b) => {return (''+a.account_name.localeCompare(b.account_name));});
				break;
			case 'total_votes':
				sortedList = this.state.topFiveCommittee.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
				break;
			case 'url':
				sortedList = this.state.topFiveCommittee.sort( (a, b) => {return (''+a.url.localeCompare(b.url));});
				break;
			default :
				break;

		}
		
		if(sortedList.length === 5) {
			sortType === 'ASC' ? this.setState({topFiveCommittee: sortedList.reverse()}) : this.setState({topFiveCommittee: sortedList}) ;
		}
	}

	getAccountName(accountId) {
		return !!this.props.accounts? this.props.accounts.find(el => el.account_id === accountId).account_name : '';
	}

	sortByRank(tableSize) {
		let sortType = this.state.sortType;
		if(this.state.sortBy === 'rank')
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		let newState = tableSize === 'big' ? this.state.searchData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse() : this.state.topFiveCommittee.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse();;
		
		if(this.state.sortType === 'ASC')
		{
			newState = newState.reverse();
		}
		tableSize === 'big' ? this.setState({searchData: newState, sortType:sortType, sortBy:'rank', currentPage: 0}) : this.setState({topFiveCommittee: newState, sortType:sortType, sortBy:'rank', currentPage: 0});
	}

	renderBigTable() {
		const { currentPage, committee, searchData, pageSize } = this.state;
		return (
			<div>
				{!!this.props.history ? // browse all page
					<div className="container pt-0 pb-5 mt-5">
						<Fragment>
							<div className="pagination-wrapper"> 
								<InputGroup>
									<Input type="text" value={committee} onChange={this.onCommitteeEnter.bind(this)} placeholder="Committee Member" />
								</InputGroup>
								<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
							</div>
							<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-0`}>
								<span className="fa fa-crown">&nbsp;</span>Browse Committee Members</h1>
							<table className="table">
								<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']}`}>
									<tr>
										<th onClick={this.sortByRank.bind(this, 'big')} scope="col">Rank</th>
										<th onClick={this.sortByColumn.bind(this, 'committee_id')} scope="col">Committee Member</th>
										<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
										<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
									</tr>
								</thead>
								{searchData && <tbody>
									{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((committee) => {
										return <CommitteeRow
											key={committee.id}
											rank={committee.rank}
											committee_name = {committee.account_name}
											committee={committee.committee_id}
											votes={committee.total_votes}
											url={committee.url}
											account_id={committee.committee_member_account}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Committee Members Found </div>}
						</Fragment>
					</div>

					:// committee widget

					<div className="container pt-0 pb-5 mt-0">
						<Fragment>
							<div className="pagination-wrapper"> 
								<InputGroup>
									<Input type="text" value={committee} onChange={this.onCommitteeEnter.bind(this)} placeholder="Committee Member" />
								</InputGroup>
								<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
							</div>
							
							<table className="table">
								<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']} `}>
									<tr>
										<th onClick={this.sortByRank.bind(this, 'big')} scope="col">Rank</th>
										<th onClick={this.sortByColumn.bind(this, 'committee_id')} scope="col">Committee Member</th>
										<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
										<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
									</tr>
								</thead>
								{searchData && <tbody>
									{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((committee) => {
										return <CommitteeRow
											key={committee.id}
											rank={committee.rank}
											committee_name = {committee.account_name}
											committee={committee.committee_id}
											votes={committee.total_votes}
											url={committee.url}
											account_id={committee.committee_member_account}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Committee Members Found </div>}
						</Fragment>
					</div>
				}
			</div>
		);
	}

	renderSmallTable() {
		const {topFiveCommittee} = this.state;
		return (
			<Fragment>
				<table className="table">
					<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']}`}>
						<tr>
							<th onClick={this.sortByRank.bind(this, 'small')} scope="col">Rank</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'committee_id')} scope="col">Committee Member</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{topFiveCommittee.map((committee) => {
							return <CommitteeRow
								key={committee.id}
								rank={committee.rank}
								committee_name = {this.getAccountName(committee.committee_member_account)}
								committee={committee.committee_id}
								votes={committee.total_votes}
								url={committee.url}
								account_id={committee.committee_member_account}
							/>;
						})}
					</tbody>
				</table>
			</Fragment>
		);
	}
	
	render() {
		return (
			<div>
				{this.props.size === 'small' ?
					this.renderSmallTable()
					:
					this.renderBigTable()
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList
});

export default connect(mapStateToProps)(Committee);