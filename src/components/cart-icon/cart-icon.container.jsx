import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import { gql } from 'apollo-boost';
import CartIcon from './cart-icon.component';

const TOGGLE_CART_HIDDEN = gql`
    mutation ToggleCartHidden {
        toggleCartHidden @client
    }
`;

const GET_ITEMS_COUNT = gql`
    {
        itemCount @client
    }
`;

// 
const CartIconContainer = (props) => {
    const { itemCount } = props.data;
    const toggleCartHidden = props.toggleCartHidden;
    return (
        <CartIcon itemCount={itemCount} toggleCartHidden={toggleCartHidden}/>
    )
}
export default flowRight(
    graphql(GET_ITEMS_COUNT),
    graphql(TOGGLE_CART_HIDDEN, { name: "toggleCartHidden" }) // will send as "mutate" without 2nd param
)(CartIconContainer);