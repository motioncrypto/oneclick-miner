import axios from 'axios';

const state = {
  currency: '',
  unpaid: 0,
  balance: 0,
  paid24h: 0,
  total: 0,
};

const mutations = {
  SET_POOL_DATA(state, payload) {
    state.currency = payload.currency;
    state.unpaid = payload.unpaid;
    state.balance = payload.balance;
    state.paid24h = payload.paid24h;
    state.total = payload.total;
  },
  RESET_POOL_DATA(state) {
    state.currency = '';
    state.unpaid = 0;
    state.balance = 0;
    state.paid24h = 0;
    state.total = 0;
  },
};

const actions = {
  fetchPoolData({ commit, rootState }) {
    axios.get(`${rootState.Settings.apiBase}/wallet?address=${rootState.Settings.wallet}`)
      .then((response) => {
        // eslint-disable-next-line
        commit('SET_POOL_DATA', response.data);
      })
      .catch((error) => {
        // eslint-disable-next-lin  e
        console.log(error);
      });
  },
};

export default {
  state,
  mutations,
  actions,
};

