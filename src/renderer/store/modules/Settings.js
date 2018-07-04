import AutoLaunch from 'auto-launch';

const minerAutoLauncher = new AutoLaunch({
  name: 'Motion Miner',
  // path: `${process.env.PORTABLE_EXECUTABLE_DIR}\\Motion Miner 0.1.3.exe`,
});

const state = {
  currentPool: 'stratum+tcp://eu.bsod.pw:2266',
  customPool: '',
  poolFee: '',
  apiBase: '',
  poolSelectedByUser: false,
  mineWith: ['gpu'],
  wallet: '',
  advancedMode: false,
  nvidiaMiner: 'enemy',
  amdMiner: 'avermore',
  autostart: {
    miner: false,
    windows: false,
  },
};

const mutations = {
  CHANGE_CURRENT_POOL(state, payload) {
    state.currentPool = payload.pool;
    state.customPool = payload.customPool;
    state.poolSelectedByUser = payload.poolSelectedByUser;
  },
  CHANGE_MINE_WITH(state, payload) {
    state.mineWith = payload.mineWith;
  },
  CHANGE_WALLET_ADDRESS(state, payload) {
    state.wallet = payload.wallet;
  },
  CHANGE_ADVANCED_MODE(state, payload) {
    state.advancedMode = payload.advancedMode;
  },
  CHANGE_NVIDIA_MINER(state, payload) {
    state.nvidiaMiner = payload.nvidiaMiner;
  },
  CHANGE_AMD_MINER(state, payload) {
    state.amdMiner = payload.amdMiner;
  },
  CHANGE_AUTOSTART(state, payload) {
    if (state.autostart.windows !== payload.windows) {
      if (payload.windows) {
        minerAutoLauncher.enable();
      } else {
        minerAutoLauncher.disable();
      }
    }

    state.autostart.miner = payload.miner;
    state.autostart.windows = payload.windows;
  },
  RESET_TO_DEFAULTS(state) {
    state.amdMiner = 'avermore';
    state.nvidiaMiner = 'enemy';
    state.poolSelectedByUser = false;
    state.autostart = {
      miner: false,
      windows: false,
    };
    state.advancedMode = false;
    state.currentPool = 'stratum+tcp://eu.bsod.pw:2266';
  },
};

const getters = {
  getCurrentPool: (state) => {
    let currentPool;
    if (state.currentPool === 'custom') {
      currentPool = state.customPool;
    } else {
      currentPool = state.currentPool;
    }
    return currentPool;
  },
};

// const actions = {
//   someAsyncTask({ commit }) {
//     // do something async
//     commit('INCREMENT_MAIN_COUNTER');
//   },
// };

export default {
  state,
  getters,
  mutations,
};
