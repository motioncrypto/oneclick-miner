<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'motion-miner',
    created() {
      this.$store.commit('RESTART_SYSTEM');
      this.$store.commit('RESET_MINER_STATUS');
      this.$store.commit('RESET_POOL_DATA');
      if (require('os').platform() !== 'win32') {
        this.$store.commit('CHANGE_MINE_WITH', {
          mineWith: [],
        });
      }
    },
  };
</script>

<style lang="scss">
  /* SCSS */
</style>
