<template>
  <section id="minerInfo">
    <div class="container">
      <div class="columns is-mobile has-text-centered">
        <div class="column is-4">
          <h2>Speed</h2>
          <div><span class="tag is-primary is-normal" v-if="settings.mineWith.includes('gpu')">GPU: {{Math.round(miner.gpuSpeed.nvidia + miner.gpuSpeed.amd)}} Kh/s</span></div>
        </div>
        <div class="column is-4">
          <h2>Shares</h2>
          <span class="tag is-info is-normal">{{miner.shares.nvidia + miner.shares.amd}}</span>
        </div>
        <div class="column is-4">
          <h2>Estimated 24 hrs</h2>
          <div><span class="tag is-primary is-normal">{{miner.rewards || 0}} XMN</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      settings: state => state.Settings,
      miner: state => state.Miner,
      system: state => state.System,
    }),
  },
  mounted() {
    setInterval(() => {
      if (this.system.mining) {
        this.$store.dispatch('fetchProfitData');
      }
    }, 120000);
  },
};
</script>

<style lang="scss" scoped>
  #minerInfo {
    margin-top: 30px;
  }

  h2 {
    font-size: 0.8em;
  }
</style>
