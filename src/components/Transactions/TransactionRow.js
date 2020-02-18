import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, TableRow, TableCell} from '@material-ui/core';

class TransactionRow extends Component {
	findAccountName(id) {
		const accountName = this.props.accounts ? this.props.accounts.find(el => el.account_id === id) : '';
		return accountName ? <span><Link className="d-inline p-0" href={`/accountAllDetail/${accountName.account_name}`}>{accountName.account_name}</Link></span>  : <span>Account Id: {id}</span>;
	}
	
	linkAccountName(accountName) {
		return accountName ? <span><Link className="d-inline p-0" href={`/accountAllDetail/${accountName}`}>{accountName}</Link></span> : accountName;
	}
  
	renderOther(operationType, parsedTransaction, i) {
		return (
			<TableCell sm="5"> <strong> {parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong> {this.findAccountName(parsedTransaction.account)}</strong></TableCell>
		);
	}
  
	displayOperation( operation ) {
		if(this.props.operations) {
			return this.props.operations[operation].friendly_name;
		}

		return;
	}

	renderTransaction(transaction, i) {
		const operationType = JSON.parse(transaction.operations)[0];
		const parsedTransaction = JSON.parse(transaction.operations)[1];

		switch(operationType) {
			case 0:
				const senderAccount = this.findAccountName(parsedTransaction.from);
				const receiverAccount = this.findAccountName(parsedTransaction.to);
				return (
					<TableCell><strong>{parsedTransaction.amount.amount}</strong> {this.displayOperation(operationType)} <strong>{receiverAccount}</strong> from <strong>{senderAccount}</strong></TableCell> 
				);
			case 5:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> paid by <strong>{this.findAccountName(parsedTransaction.registrar)}</strong> for {this.displayOperation(operationType)} <strong>{this.linkAccountName(parsedTransaction.name)}</strong></TableCell>
				);
			case 6:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.account)}</strong></TableCell>
				);
			case 8:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.account_to_upgrade)}</strong></TableCell>
				);
			case 20:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.witness_account)}</strong></TableCell>
				);
			case 29:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.committee_member_account)}</strong></TableCell>
				);
			case 37:
				return (
					<TableCell><strong>{parsedTransaction.total_claimed.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.deposit_to_account)}</strong></TableCell>
				);
			case 47:
				return (
					<TableCell><strong>{parsedTransaction.fee.amount}</strong> {this.displayOperation(operationType)} <strong>{this.findAccountName(parsedTransaction.registrar)}</strong></TableCell>
				);
			default:
				return this.renderOther(transaction, operationType, parsedTransaction, i);
		}
	}
  
	render() {
		const {detail, key} = this.props;
		return (
			<TableRow hover={true} key={key}>
				{this.renderTransaction(detail)}
			</TableRow>
		);
	}
}

const mapStateToProps = (state) => ({
	accounts: state.accounts.accountList,
	operations: state.transactions.operations
});

export default connect(mapStateToProps)(TransactionRow);