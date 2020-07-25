import React, { Component } from 'react';
import '../App.css';

import {stock} from '../redux/data';

import {connect} from 'react-redux';
import { fetchCart } from '../redux/actions';

class Payment extends Component{
  constructor(props){
    super(props);
    this.state = {
        shipping: {
            name:"", address1:"", address2:"",
            city:"", state:"", zipcode:"", contact:"",
        },
        billing: {
            name:"", address1:"", address2:"",
            city:"", state:"", zipcode:"", contact:"",
        },
        card:{
            type:"VISA", number:"", expiryMonth:"", expiryYear:"", cvv:""
        },
        sameAsChecking: false,
        paymentSuccess: false,
        redirection: 4,
				totalAmount: 0,
				shippingErrors:[], 
				billingErrors:[],
				cardErrors:[]
    };
  }

  componentDidMount(){
    if(this.props.location.state == undefined)
      this.props.history.push("/");
   	else
      this.setState({totalAmount: this.props.location.state.totalAmount.toFixed(2)});
	}
	
	validateAddress(addrObj){
		var error = [];
		var phoneregex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

		if(addrObj.name.length < 3)
			error.push(0);
		
		if(addrObj.address1.length < 5)
			error.push(1);
		
		if(addrObj.city.length < 2)
			error.push(3);
			
		if(addrObj.state.length < 2)
			error.push(4);
		
		if(addrObj.zipcode.length < 3)
			error.push(5);
		
		if(!phoneregex.test(addrObj.contact))
			error.push(6);

		return error;
	}

	validateCard(cardObj){
		var error = [];
		var today,expday;

		if(cardObj.number.length != 16 || isNaN(cardObj.number))
			error.push(0);
		
		if(isNaN(cardObj.expiryMonth) || parseInt(cardObj.expiryMonth) > 12 || parseInt(cardObj.expiryMonth) < 1)
			error.push(1);
		
		if(cardObj.expiryYear.length != 4)
			error.push(2);

		today = new Date();
		expday = new Date();
		expday.setFullYear(cardObj.expiryYear, cardObj.expiryMonth, 1);
		
		if (expday < today) {
				error.push(1);
				error.push(2);
		}
		
		
		if(cardObj.cvv.length != 3 || isNaN(cardObj.cvv))
			error.push(3);
		
		return error;
	}

  makePayment(){
		const {shipping,billing,card} = this.state;
		var shippingErrors = this.validateAddress(shipping);
		var billingErrors = this.validateAddress(billing);
		var cardErrors = this.validateCard(card);

		if(shippingErrors.length == 0 && billingErrors.length == 0 && cardErrors == 0){
			var i = 3;
			this.setState({paymentSuccess: true});
			this.props.fetchCart([]);
			
			var interval = setInterval(() => {
					this.setState({redirection: i});
					i--;
			},1000);

			setTimeout(() => {
					clearInterval(interval);
					this.props.history.push("/");
			},3000);
		}else{
			this.setState({
				shippingErrors, billingErrors, cardErrors
			})
		} 
  }

  render(){
    const {shipping,billing,card,sameAsChecking,paymentSuccess,redirection,totalAmount,shippingErrors, billingErrors, cardErrors} = this.state;
    return(
      <div className="App">
        <div className="header">
          <label  onClick={() => this.props.history.push('/')} 
                  style={{cursor:'pointer'}}
                  className="logoText">My Delivery World {shipping.name}</label>
          <button onClick={() => this.props.history.push('/')} className="back-to-listing">Back To Products</button>
        </div>
        {
            paymentSuccess
            ?
            <div className="content no-checkout">
                <h6>Congrats!!! Your Payment is Successful, Redirecting in {redirection} Seconds</h6>
            </div>
            :
            <div className="content" style={{marginTop:'1%'}}>
                <div className="col-md-4 col-sm-6 col-xs-12 address-div">
                <label className="address-div-label">Shipping Information</label>
										<input  placeholder="Name" value={shipping.name}
														className={shippingErrors.includes(0) ? "error-input" : ""}
                            onChange={(e) => {shipping["name"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="Address Line 1" value={shipping.address1}
														className={shippingErrors.includes(1) ? "error-input" : ""}
														onChange={(e) => {shipping["address1"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="Address Line 2" value={shipping.address2}
                            onChange={(e) => {shipping["address2"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="City" value={shipping.city}
														className={shippingErrors.includes(3) ? "error-input" : ""}
														onChange={(e) => {shipping["city"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="State" value={shipping.state}
														className={shippingErrors.includes(4) ? "error-input" : ""}
														onChange={(e) => {shipping["state"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="Zipcode" value={shipping.zipcode}
														className={shippingErrors.includes(5) ? "error-input" : ""}
														onChange={(e) => {shipping["zipcode"] = e.target.value; this.setState({shipping})}} />
                    <input  placeholder="Contact" value={shipping.contact}
														className={shippingErrors.includes(6) ? "error-input" : ""}
														onChange={(e) => {shipping["contact"] = e.target.value; this.setState({shipping})}} />
                    <div className="same-as-shipping">
                        <input  type="checkbox" style={{maxWidth:'4%'}}
                                onChange={() => {
                                    if(!sameAsChecking){
                                        var tempAddress = Object.assign({}, shipping);
                                        this.setState({billing: tempAddress});
                                    }
                                    this.setState({sameAsChecking: !sameAsChecking})
                                }} />
                        <label className="same-text">Billing Address same as Shipping</label>
                    </div>
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 address-div border-div">
                    <label className="address-div-label">Billing Information</label>
                    <input  placeholder="Name" value={billing.name}
														className={billingErrors.includes(0) ? "error-input" : ""}
														onChange={(e) => {billing["name"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="Address Line 1" value={billing.address1}
														className={billingErrors.includes(1) ? "error-input" : ""}
														onChange={(e) => {billing["address1"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="Address Line 2" value={billing.address2}
                            onChange={(e) => {billing["address2"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="City" value={billing.city}
														className={billingErrors.includes(3) ? "error-input" : ""}
														onChange={(e) => {billing["city"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="State" value={billing.state}
														className={billingErrors.includes(4) ? "error-input" : ""}
														onChange={(e) => {billing["state"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="Zipcode" value={billing.zipcode}
														className={billingErrors.includes(5) ? "error-input" : ""}
														onChange={(e) => {billing["zipcode"] = e.target.value; this.setState({billing})}} />
                    <input  placeholder="Contact" value={billing.contact}
														className={billingErrors.includes(6) ? "error-input" : ""}
														onChange={(e) => {billing["contact"] = e.target.value; this.setState({billing})}} />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 address-div">
                    <label className="address-div-label">Credit Card Information</label>
                    <select value={card.type} onChange={(e) => {card["type"] = e.target.value; this.setState({card})}}>
                        <option value="VISA">VISA Card</option>
                        <option value="MasterCard">MasterCard</option>
                    </select>
                    <input  placeholder="Card Number" value={card.number}
														className={cardErrors.includes(0) ? "error-input" : ""}
														onChange={(e) => {card["number"] = e.target.value; this.setState({card})}} />
                    <div className="card-number-div">
                        <input  placeholder="E-Month (MM) " value={card.expiryMonth}
                                style={{width: '42.5%'}} className={cardErrors.includes(1) ? "error-input" : ""}
                                onChange={(e) => {card["expiryMonth"] = e.target.value; this.setState({card})}} />
                        <input  placeholder="E-Year (YYYY)" value={card.expiryYear}
                                style={{width: '42.5%'}} className={cardErrors.includes(2) ? "error-input" : ""}
                                onChange={(e) => {card["expiryYear"] = e.target.value; this.setState({card})}} />
                    </div>
                    <input  placeholder="Security Code" value={card.cvv}
														className={cardErrors.includes(3) ? "error-input" : ""}
														onChange={(e) => {card["cvv"] = e.target.value; this.setState({card})}} />
                    <h6 className="total-amount-h6">Total Payable: <span>${totalAmount}</span></h6>
                    <button style={{float: 'none'}} onClick={() => this.makePayment()} className="checkout">Make Payment</button>
                </div>
            </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = function mapDispatchToProps (dispatch) {
  return {
    fetchCart: (cart) => dispatch(fetchCart(cart))
  }
}

export default connect(null,mapDispatchToProps)(Payment);