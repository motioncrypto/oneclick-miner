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
};

export default {
  state,
  mutations,
};
