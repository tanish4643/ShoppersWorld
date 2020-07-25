import React, { Component } from 'react';
import '../App.css';

import {stock} from '../redux/data';

import {connect} from 'react-redux';
import { fetchCart } from '../redux/actions';
class ShoppingCart extends Component{
  constructor(props){
    super(props);
    this.state = {
      cart: [],
      finalCart: [],
      totalAmount:0,
      productIds:[]
    };
  }

  componentDidMount(){
    var cart = localStorage.getItem('cart');

    if(cart){
      cart = JSON.parse(cart);
      var productIds = cart.map(item => item.id);
      var cartTemp = Array(productIds.length);
      var temp,totalAmount = 0;

      for(var i=0; i<stock.length; i++){
        if(productIds.includes(stock[i].id)){
          temp = stock[i];
          temp.quantity = cart[productIds.indexOf(stock[i].id)].quantity;
          cartTemp[productIds.indexOf(stock[i].id)] = temp;
          totalAmount += (temp.quantity * temp.price);
        }
      }

      this.setState({
        cart, productIds: productIds,
        finalCart: cartTemp, 
        totalAmount: totalAmount
      });
    }
  }

  incrementProduct(id){
    var cart = this.state.cart;
    var finalCart = this.state.finalCart;
    var totalAmount = this.state.totalAmount;
    var index = this.state.productIds.indexOf(id);
    
    cart[index].quantity += 1;
    totalAmount += finalCart[index].price;
    finalCart[index].quantity += 1;

    this.setState({ cart, finalCart, totalAmount});
    this.props.fetchCart(cart);
  }

  decrementProduct(id){
    var cart = this.state.cart;
    var finalCart = this.state.finalCart;
    var totalAmount = this.state.totalAmount;
    var index = this.state.productIds.indexOf(id);

    if(cart[index].quantity > 1){
      cart[index].quantity -= 1;
      totalAmount -= finalCart[index].price;
      finalCart[index].quantity -= 1;
      this.setState({ cart, finalCart, totalAmount});
      this.props.fetchCart(cart);
    }
  }

  removeItem(id){
    var cart = this.state.cart;
    var finalCart = this.state.finalCart;
    var productIds = this.state.productIds;
    var totalAmount = this.state.totalAmount;
    var index = productIds.indexOf(id);

    totalAmount -= (finalCart[index].quantity * finalCart[index].price);
    cart = cart.filter(item => item.id != id);

    this.setState({
      finalCart: finalCart.filter(item => item.id != id),
      productIds: productIds.filter(item => item != id),
      totalAmount, cart
    });
    this.props.fetchCart(cart);
  }

  render(){
    const {finalCart,sname,totalAmount} = this.state;
    return(
      <div className="App">
        <div className="header">
          <label  onClick={() => this.props.history.push('/')} 
                  style={{cursor:'pointer'}}
                  className="logoText">My Delivery World</label>
          <button onClick={() => this.props.history.push('/')} className="back-to-listing">Back To Products</button>
        </div>
        {
          finalCart.length > 0
          ?
          <div className="content">
            {finalCart.map((item,index) => {
              return(
                <div key={index} className="col-xs-12 prod-view">
                    <div className="col-sm-6 col-xs-12 cart-product">
                      <img className="cart-img" src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/320546_2200-732x549.jpg" />
                      <div className="cart-prod-info">
                        <h6 className="cart-title">{item.name}</h6>
                        <p className="cart-category">{item.category}</p>
                        <p className="cart-price-quantity">{item.quantity} x ${item.price}</p>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xs-12">
                      <h6 className="cart-price-h6">${(item.quantity * item.price).toFixed(2)}</h6>
                      <div className="cart-buttons">
                        {
                          item.quantity > 1
                          ?
                          <img onClick={() => this.decrementProduct(item.id)} src={require('../images/minus.png')} className="cart-trash" />
                          :
                          <img  src={require('../images/minus_in.png')} 
                                style={{cursor:'not-allowed'}} className="cart-trash" />
                        }
                        <img onClick={() => this.removeItem(item.id)} src={require('../images/trash.png')} className="cart-trash" />
                        <img onClick={() => this.incrementProduct(item.id)} src={require('../images/add.png')} className="cart-trash" />
                      </div>
                    </div>
                </div>
              )
            })}
            <h6 className="total-amount-h6">Total Payable: <span>${totalAmount.toFixed(2)}</span></h6>
            <button onClick={() => this.props.history.push('Payment',{totalAmount: totalAmount})} className="checkout">CHECKOUT</button>
          </div>
          :
          <div className="content no-checkout">
            <h6>Nothing here to pay for, <span onClick={() => this.props.history.push("/")} >Click here</span> to get a list of our products</h6>
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

export default connect(null,mapDispatchToProps)(ShoppingCart);