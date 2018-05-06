<template>
  <section id="minerInfo">
    <div class="container">
      <div class="columns is-mobile has-text-centered">
        <div class="column is-6">
          <h2>Speed</h2>
          <div><span class="tag is-primary is-normal" v-if="settings.mineWith.includes('gpu')">GPU: {{Math.round(miner.gpuSpeed.nvidia + miner.gpuSpeed.amd)}} Kh/s</span></div>
        </div>
        <div class="column is-6">
          <h2>Shares</h2>
          <span class="tag is-info is-large">{{miner.shares.nvidia + miner.shares.amd}}</span>
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
    }),
  },
};
</script>

<style lang="scss">
  #minerInfo {
    margin-top: 30px;
  }
</style>
