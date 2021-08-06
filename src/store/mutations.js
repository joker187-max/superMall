import {
  ADD_COUNT,
  ADD_TO_CART
} from './mutation-types'

export default {
  [ADD_COUNT](state, payload) {
    payload.count ++;
},
  [ADD_TO_CART](state, payload) {
    payload.checked = true;
    state.cartList.push(payload);
}

}

