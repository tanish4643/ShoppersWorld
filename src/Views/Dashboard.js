import React, { Component } from 'react';
import '../App.css';
import {categories,stock} from '../redux/data';

import {connect} from 'react-redux';
import { fetchCart } from '../redux/actions';

class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      active: 0,
      productsInCart:[],
      cart: []
    };
  }

  componentDidMount(){
    var cart = localStorage.getItem('cart');
    
    if(cart)
      cart = JSON.parse(cart);      
    else
      cart = [];

    this.setState({
      productsInCart: cart.map(item => item.id),
      cart: cart
    })

    this.props.fetchCart(cart);
  }

  addProductCart(item){
    var cart = this.state.cart;
    var productsInCart = this.state.productsInCart;

    cart.push({id: item.id, quantity: 1});
    productsInCart.push(item.id);
    
    this.props.fetchCart(cart);
    this.setState({productsInCart: productsInCart, cart: cart});
  }

  incrementProduct(id){
    var cart = this.state.cart;
    var productsInCart = this.state.productsInCart;
    cart[productsInCart.indexOf(id)].quantity += 1;
    this.setState({cart});
    this.props.fetchCart(cart);
  }

  decrementProduct(id){
    var cart = this.state.cart;
    var productsInCart = this.state.productsInCart;

    if(cart[productsInCart.indexOf(id)].quantity > 1)
      cart[productsInCart.indexOf(id)].quantity -= 1;
    else{
      cart = cart.filter(item => item.id != id);
      productsInCart = productsInCart.filter(item => item != id);
    }

    this.setState({
      cart: cart,
      productsInCart: productsInCart
    });
    this.props.fetchCart(cart);
  }

  render(){
    const {active,productsInCart,cart} = this.state;
    return(
      <div className="App">
        <div className="header">
          <label className="logoText">My Delivery World</label>
          <div className="header-cart" onClick={() => this.props.history.push('/cart')}>
            <img src={require('../images/cart.png')} className="cart-icon" />
            <label className="cart-items">{productsInCart.length}</label>
          </div>
        </div>
        <div className="content">
          <div className="col-md-3 col-sm-4 col-xs-12 category-div">
            {categories.map((item,index) => {
              return(
                <button style={active == index ? {backgroundColor: '#0091DC'} : {}} 
                        onClick={() => this.setState({active: index})} key={index}>{item}</button>
              )
            })}
          </div>
          <div className="col-md-9 col-sm-8 col-xs-12 product-div">
              {stock.map((item,index) => {
                if(active == 0 || item.categoryIndex == active)
                  return(
                    <div className="col-md-4 col-sm-6 col-xs-12 ind-prod-div" key={index}>
                      <img src={item.image} className="product-image" />
                      <div className="info-div">
                        <h6>{item.name}</h6>
                        <label>${item.price}</label>
                      </div>
                      {
                        !productsInCart.includes(item.id)
                        ?
                        <div className="cart-div" onClick={() => this.addProductCart(item)}>
                          <button className="add-to-cart">Add to Cart</button>
                        </div>
                        :
                        <div className="cart-buttons-div">
                          <button onClick={() => this.decrementProduct(item.id)} className="incr-button">-</button>
                          <label style={{marginBottom:0}} className="quan-button">{cart[productsInCart.indexOf(item.id)].quantity}</label>
                          <button onClick={() => this.incrementProduct(item.id)} className="incr-button">+</button>
                        </div>
                      }                      
                      
                    </div>
                  )
              })}
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = function mapDispatchToProps (dispatch) {
  return {
    fetchCart: (cart) => dispatch(fetchCart(cart))
  }
}

export default connect(null,mapDispatchToProps)(Dashboard);