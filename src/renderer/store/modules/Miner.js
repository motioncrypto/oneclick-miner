import axios from 'axios';

const state = {
  gpuSpeed: {
    nvidia: 0,
    amd: 0,
  },
  temps: [],
  shares: {
    nvidia: 0,
    amd: 0,
  },
  console: [],
  profit: 0,
  rewards: 0,
  currentPrice: 0,
  currentBtcPrice: 0,
};

const mutations = {
  UPDATE_NVIDIA_SPEED(state, payload) {
    state.gpuSpeed.nvidia = Number(payload.speed);
    state.shares.nvidia = Number(payload.shares);
  },
  UPDATE_AMD_SPEED(state, payload) {
    state.gpuSpeed.amd = Number(payload.speed);
    state.shares.amd = Number(payload.shares);
  },
  RESET_MINER_STATUS(state) {
    state.gpuSpeed = {
      nvidia: 0,
      amd: 0,
    };
    state.temps = [];
    state.shares = {
      nvidia: 0,
      amd: 0,
    };
    state.console = [];
  },
  UPDATE_TEMPS(state, payload) {
    state.temps = payload.temps;
  },
  UPDATE_SHARES(state, payload) {
    state.shares = payload.shares;
  },
  APPEND_CONSOLE(state, payload) {
    state.console.push(payload.log);
  },
  UPDATE_PROFITS(state, payload) {
    state.profit = payload.profit;
    state.rewards = payload.rewards;
    state.currentPrice = payload.currentPrice;
  },
  UPDATE_BTC_PRICE(state, payload) {
    state.currentBtcPrice = payload.currentBtcPrice;
  },
};

const actions = {
  fetchProfitData({ commit, state }) {
    axios.get(`https://whattomine.com/coins/248-xmn-x16r.json?utf8=%E2%9C%93&hr=${(state.gpuSpeed.nvidia + state.gpuSpeed.amd) / 1000}&p=0&fee=2&cost=0&hcost=0.0&commit=Calculate`)
      .then((response) => {
        commit('UPDATE_PROFITS', {
          rewards: response.data.estimated_rewards,
          profit: response.data.profit,
          currentPrice: response.data.exchange_rate,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  },
  fetchCurrentBtcPrice({ commit }) {
    axios.get('https://api.livecoin.net/exchange/ticker?currencyPair=BTC/USD')
      .then((response) => {
        commit('UPDATE_BTC_PRICE', {
          currentBtcPrice: response.data.last,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  },
};

export default {
  state,
  mutations,
  actions,
};
