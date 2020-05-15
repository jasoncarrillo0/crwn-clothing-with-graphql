import { gql } from 'apollo-boost';
import { addItemToCart, getCartItemsCount } from './cart.utils';
export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }

    extend type Mutation {
        ToggleCartHidden: Boolean!
        AddItemToCart(item: Item!): [Item]!
    }
`;

// the "@client" means that it will find the property in the local cache, not the back end
const GET_CART_HIDDEN = gql`
    {
        cartHidden @client 
    }
`;

const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`;

const GET_CART_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;
// mutation keys functions will take in 4 arguments------------
// _root: top level object, or parent schema it's related to
// _args: arguments passed to a query, defined in the schema
// _context: holds the cache of the app and the client
// _info: info about the query or mutation
export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, { cache }) => {
            const { cartHidden } = cache.readQuery({
                query: GET_CART_HIDDEN
                // potentially you can add a variables key
            });

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: { cartHidden: !cartHidden }
            });

            return !cartHidden
        },

        addItemToCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = addItemToCart(cartItems, item);

            cache.writeQuery({
                query: GET_CART_ITEM_COUNT,
                data: { itemCount: getCartItemsCount(newCartItems)}
            });
            cache.writeQuery({
                query: GET_CART_ITEMS,
                data: { cartItems: newCartItems }
            });
            return newCartItems;
        }
    }
}