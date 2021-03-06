import React, { Component } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {NavLink} from 'reactstrap';

class CommitteeRow extends Component {
	render() {
		return (
			<tr>
				<td className="align-middle">{this.props.rank}</td>
				<td className="align-middle"><NavLink tag={RRNavLink} to={`/accountAllDetail/${this.props.committee_name}/${this.props.committee}`}>{this.props.committee_name}</NavLink></td>
				<td className="align-middle">{this.props.votes}</td>
				<td className="align-middle">{this.props.url}</td>
			</tr>
		);
	}
}

export default CommitteeRow;