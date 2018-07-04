<template>
  <main>
    <h1>Settings</h1>
    <div class="wallet-address">
      <div class="field-container">
        <b-field label="Which pool do you want to use?">
          <b-select 
          v-model="poolSelected"
          placeholder="Select a pool"
          @input="poolChanged = true;">
            <option
              v-for="pool in pools"
              :value="pool"
              :key="pool.url">
              {{ pool.name }}
            </option>
            <option value="custom">Custom pool...</option>
          </b-select>
        </b-field>
      </div>
      <div class="field-container" v-if="poolSelected === 'custom'">
        <b-field label="Please enter the full Stratum URL Server with port">
          <b-input v-model="customPool" placeholder="stratum+tcp://eu.cryptoally.net:4233"></b-input>
        </b-field>
      </div>
      <div class="field-container">
        <div class="block">
          <b-field label="Which miner want to use in nVidia?"></b-field>
          <div class="field">
            <b-radio v-model="nvidiaMiner"
              native-value="enemy">
              Z-Enemy
            </b-radio>
          </div>
          <div class="field">
            <b-radio v-model="nvidiaMiner"
              native-value="suprminer">
              Suprminer
            </b-radio>
          </div>
        </div>
        <div class="block">
          <b-field label="Which miner want to use in AMD Graphics?"></b-field>
          <div class="field">
            <b-radio v-model="amdMiner"
              native-value="avermore">
              Avermore
            </b-radio>
          </div>
          <div class="field">
            <b-radio v-model="amdMiner"
              native-value="sgminer">
              SGMiner-kl
            </b-radio>
          </div>
        </div>
        <label class="label">Autostart mining</label>
        <div class="block">
          <div class="field">
            <b-checkbox v-model="autostartMiner">
              At Motion Miner Start
            </b-checkbox>
            <b-checkbox v-model="autostartWindows">
              At Windows Start
            </b-checkbox>
          </div>
        </div>
        <!-- <label class="label">Advanced</label>
        <div class="block">
          <b-checkbox v-model="advancedMode">
            Show mining console?
          </b-checkbox>
        </div> -->
      </div>
    </div>
    <div class="field is-grouped save-settings">
      <div class="control">
        <button class="button is-medium is-primary" @click="defaults()">Reset settings</button>
      </div>
    </div>

    <div class="settings">
      <b-tooltip label="Return" :animated="true">
        <router-link to="landing-page" class="button is-success is-rounded">
          <i class="fas fa-arrow-left"></i>
        </router-link>
      </b-tooltip>
      <b-tooltip label="Save Settings" :animated="true">
        <button @click="save()" class="button is-rounded is-primary">
          <i class="fas fa-save"></i>
        </button>
      </b-tooltip>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      pools: [],
      customPool: '',
      poolSelected: null,
      poolSelectedByUser: false,
      poolFee: 0,
      apiBase: '',
      poolChanged: false,
      mineWith: ['gpu'],
      advancedMode: false,
      platform: require('os').platform(),
      nvidiaMiner: 'enemy',
      amdMiner: 'avermore',
      autostartMiner: false,
      autostartWindows: false,
    };
  },
  methods: {
    save() {
      this.$store.commit('CHANGE_CURRENT_POOL', {
        poolSelected: this.poolSelected,
        pool: this.poolSelected.url,
        customPool: this.customPool,
        poolSelectedByUser: this.poolChanged,
        poolFee: this.poolSelected.fees,
        apiBase: this.poolSelected.apiUrl,
      });
      this.$store.commit('CHANGE_MINE_WITH', {
        mineWith: this.mineWith,
      });
      this.$store.commit('CHANGE_ADVANCED_MODE', {
        advancedMode: this.advancedMode,
      });
      this.$store.commit('CHANGE_NVIDIA_MINER', {
        nvidiaMiner: this.nvidiaMiner,
      });
      this.$store.commit('CHANGE_AMD_MINER', {
        amdMiner: this.amdMiner,
      });
      this.$store.commit('CHANGE_AUTOSTART', {
        miner: this.autostartMiner,
        windows: this.autostartWindows,
      });
      this.$toast.open({
        duration: 3000,
        message: 'Changes saved',
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    defaults() {
      this.$store.commit('RESET_TO_DEFAULTS');
      this.poolSelected = this.$store.state.Settings.poolSelected;
      this.pool = this.$store.state.Settings.currentPool;
      this.customPool = this.$store.state.Settings.customPool;
      this.poolSelectedByUser = this.$store.state.Settings.poolSelectedByUser;
      this.poolFee = this.$store.state.Settings.poolFee;
      this.apiBase = this.$store.state.Settings.apiBase;
      this.mineWith = this.$store.state.Settings.mineWith;
      this.advancedMode = this.$store.state.Settings.advancedMode;
      this.nvidiaMiner = this.$store.state.Settings.nvidiaMiner;
      this.amdMiner = this.$store.state.Settings.amdMiner;
      this.autostartMiner = this.$store.state.Settings.autostart.miner;
      this.autostartWindows = this.$store.state.Settings.autostart.windows;
      this.getPools();
      this.$toast.open({
        duration: 3000,
        message: 'Settings resetted to defaults',
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    getPools() {
      const firestore = window.firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
      firestore
        .collection('pools')
        .get()
        .then((pools) => {
          this.pools = [];
          pools.forEach((pool) => {
            this.pools.push(pool.data());

            if (pool.data().url === this.$store.state.Settings.currentPool) {
              this.poolSelected = pool.data();
            }

            if (pool.data().default && !this.poolSelectedByUser) {
              console.log('entre');
              this.poolSelected = pool.data();
              this.$store.commit('CHANGE_CURRENT_POOL', {
                pool: this.poolSelected,
                customPool: this.customPool,
                poolSelectedByUser: false,
                poolFee: this.poolFee,
                apiBase: this.apiBase,
              });
            }
          });
        });
    },
  },
  created() {
    this.getPools();
    this.poolSelected = this.$store.state.Settings.poolSelected;
    this.pool = this.$store.state.Settings.currentPool;
    this.customPool = this.$store.state.Settings.customPool;
    this.poolSelectedByUser = this.$store.state.Settings.poolSelectedByUser;
    this.poolFee = this.$store.state.Settings.poolFee;
    this.apiBase = this.$store.state.Settings.apiBase;
    this.mineWith = this.$store.state.Settings.mineWith;
    this.advancedMode = this.$store.state.Settings.advancedMode;
    this.nvidiaMiner = this.$store.state.Settings.nvidiaMiner;
    this.amdMiner = this.$store.state.Settings.amdMiner;
    this.autostartMiner = this.$store.state.Settings.autostart.miner;
    this.autostartWindows = this.$store.state.Settings.autostart.windows;
  },
};
</script>

<style lang="scss" scoped>
main {
  padding: 10px 80px;
}

span.select,
select,
.select select:not([multiple]) {
  width: 100% !important;
}

.field-container {
  margin: 30px auto;
}

.save-settings {
  margin-top: 50px;

  .control {
    margin: 0 auto;
    text-align: center;
  }
}

.settings {
  position: fixed;
}
</style>
