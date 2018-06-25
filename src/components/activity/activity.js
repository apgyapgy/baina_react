import React,{ Component } from 'react';
class Activity extends Component{
	componentDidMount(){
		console.log("aid:",this.props.location.query)
	}
	render(){
		return(
			<div>activity</div>
		)
	}
}
export default Activity;