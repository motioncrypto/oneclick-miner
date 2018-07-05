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
  },
};

const actions = {
  fetchProfitData({ commit, rootState }) {
    axios.get(`https://whattomine.com/coins/248-xmn-x16r.json?utf8=%E2%9C%93&hr=${(rootState.Miner.gpuSpeed.nvidia + rootState.Miner.gpuSpeed.amd) / 1000}&p=0&fee=2&cost=0&hcost=0.0&commit=Calculate`)
      .then((response) => {
        console.log(response.data);
        commit('UPDATE_PROFITS', {
          rewards: response.data.estimated_rewards,
          profit: response.data.profit,
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
