<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="motion-coin">
    <main>
      <h1>Lite Miner</h1>
      <div class="wallet-address">
        <b-field label="Your Motion Wallet Address">
            <b-input v-model="wallet"></b-input>
        </b-field>
      </div>
      <Numbers v-if="!settings.advancedMode"></Numbers>
      <Console v-if="settings.advancedMode"></Console>
      <!-- <Pool></Pool> -->
      <div class="field is-grouped start-mining">
        <div class="control">
          <button class="button is-medium is-primary" @click="startMine()" v-if="!system.mining">Start mining</button>
          <button class="button is-medium is-primary" @click="stopMine()" v-if="system.mining">Stop mining</button>
        </div>
      </div>
      <div class="donations">
        <p>System type: {{system.gpu}}</p>
      </div>
      <div class="settings">
        <b-tooltip label="Settings" :animated="true">
          <router-link to="settings" class=" is-text">
            <i class="fas fa-cog"></i>
          </router-link>
        </b-tooltip>
      </div>
    </main>
  </div>
</template>

<script>
import 'hazardous';
import { exec } from 'child_process';
import { mapState, mapGetters } from 'vuex';
import { clearInterval } from 'timers';
import net from 'net';
import xgminer from 'xgminer';
import path from 'path';

import Numbers from './Statistics/Numbers';
import Console from './Statistics/Console';
import Pool from './Statistics/Pool';

export default {
  name: 'landing-page',
  data() {
    return {
      platform: require('os').platform(),
      amdInfo: null,
      nvidiaInfo: null,
      nvidiaCount: 0,
      amdCount: 0,
    };
  },
  components: {
    Numbers,
    Console,
    Pool,
  },
  computed: {
    ...mapState({
      settings: state => state.Settings,
      system: state => state.System,
    }),
    ...mapGetters({
      currentPool: 'getCurrentPool',
    }),
    wallet: {
      get() {
        return this.$store.state.Settings.wallet;
      },
      set(value) {
        this.$store.commit('CHANGE_WALLET_ADDRESS', {
          wallet: value,
        });
      },
    },
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    startMine() {
      this.$toast.open({
        duration: 3000,
        message: 'Here we go!',
        position: 'is-bottom',
        type: 'is-primary',
      });

      if ((this.platform === 'win32' || this.platform === 'win')
      && this.settings.mineWith.includes('gpu')) {
        this.mineWithGpu();
      }
      this.$store.commit('RESET_MINER_STATUS');
      this.$store.commit('TOGGLE_MINING');
    },
    getGpu() {
      exec('wmic path win32_VideoController get name', (error, stdout, stderr) => {
        if (stdout.indexOf('NVIDIA') > -1 || stderr.indexOf('NVIDIA') > -1) {
          this.$store.commit('CHANGE_GPU', {
            gpu: 'nvidia',
          });

          if (stdout.indexOf('Radeon') > -1 || stderr.indexOf('Radeon') > -1) {
            this.$store.commit('CHANGE_GPU', {
              gpu: 'hybrid',
            });
          }
        } else {
          this.$store.commit('CHANGE_GPU', {
            gpu: 'amd',
          });
        }
      });
    },
    setPids(originalPid) {
      this.$store.commit('ADD_PID', {
        pid: originalPid,
      });
      const children = exec(`wmic process where (ParentProcessId=${originalPid}) get ProcessId`);
      children.stdout.on('data', (data) => {
        const pids = data.split('\n');
        pids.forEach((pid) => {
          if (!isNaN(Number(pid)) && Number(pid) > 0) {
            this.$store.commit('ADD_PID', {
              pid,
            });

            this.setPids(pid);
          }
        });
      });
    },
    runAMD(minerPath) {
      const miner = exec(`start cmd.exe /K "set GPU_MAX_ALLOC_PERCENT=100 && \
      set GPU_USE_SYNC_OBJECTS=1 && \
      set GPU_FORCE_64BIT_PTR=0 && \
      set GPU_MAX_HEAP_SIZE=100 && \
      set GPU_SINGLE_ALLOC_PERCENT=100 && \
      ${path.join(__static, minerPath)}/amd/${this.settings.amdMiner}/miner \
      --algorithm x16r \
      --api-listen \
      --api-allow W:127.0.0.1 \
      --api-port=4028 \
      -o ${this.currentPool} \
      -u ${this.settings.wallet} \
      -p c=MTN \
      -X 256 \
      --kernel-path=""${path.join(__static, minerPath)}/amd/${this.settings.amdMiner}/kernel""`);

      this.amdInfo = setInterval(() => {
        // eslint-disable-next-line
        const client = new xgminer('127.0.0.1', '4028');
        client.summary().then((info) => {
          this.$store.commit('UPDATE_AMD_SPEED', {
            speed: info.SUMMARY[0]['KHS 5s'],
            shares: info.SUMMARY[0].Accepted,
          });
        }, (err) => {
          console.log('error', err);
        });
      }, 10000);

      this.setPids(miner.pid);

      miner.on('close', () => {
        if (this.system.mining) {
          this.runAMD(minerPath);
        } else {
          this.$store.commit('APPEND_CONSOLE', {
            log: 'AMD GPU Miner is now stopped',
          });
          this.$toast.open({
            duration: 3000,
            message: 'AMD GPU miner is now stopped',
            position: 'is-bottom',
            type: 'is-primary',
          });

          clearInterval(this.amdInfo);
        }
      });
    },
    runNvidia(minerPath) {
      const miner = exec(`start cmd.exe /K "${path.join(__static, minerPath)}/nvidia/${this.settings.nvidiaMiner}/miner \
        --algo=x16r --url=${this.currentPool} --user=${this.settings.wallet} -b 0.0.0.0:4068 -p c=MTN"`);

      console.log(`start cmd.exe /K "${path.join(__static, minerPath)}/nvidia/${this.settings.nvidiaMiner}/miner \
        --algo=x16r --url=${this.currentPool} --user=${this.settings.wallet} -b 0.0.0.0:4068 -p c=MTN"`);

      this.setPids(miner.pid);

      this.nvidiaInfo = setInterval(() => {
        const client = new net.Socket();
        client.connect(4068, '127.0.0.1', () => {
          client.write('summary');
        });

        client.on('data', (data) => {
          data = data.toString('utf8').slice(0, -1);
          data = `{"${data.replace(/;/g, '","').replace(/=/g, '":"').replace('|', '"').replace(/\s/, '')}}`;
          const info = JSON.parse(data);
          this.$store.commit('UPDATE_NVIDIA_SPEED', {
            speed: info.KHS,
            shares: info.ACC,
          });
        });

        client.on('error', (error) => {
          console.log('Error', error);
          clearInterval(this.nvidiaInfo);

          if (this.system.mining && this.nvidiaCount > 5) {
            this.stopMine(false);
            this.nvidiaCount = 0;
          } else if (this.system.mining) {
            this.nvidiaCount += 1;
          }
        });

        client.on('end', () => {
          clearInterval(this.nvidiaInfo);
        });
      }, 10000);

      miner.on('close', () => {
        if (this.system.mining) {
          this.runNvidia(minerPath);
        } else {
          this.$store.commit('APPEND_CONSOLE', {
            log: 'nVidia GPU Miner is now stopped',
          });
          this.$toast.open({
            duration: 3000,
            message: 'nVidia GPU miner is now stopped',
            position: 'is-bottom',
            type: 'is-primary',
          });
          clearInterval(this.nvidiaInfo);
        }
      });
    },
    mineWithGpu() {
      // this.stopMine(false);
      const minerPath = `miners/${this.platform}`;
      this.nvidiaCount = 0;
      this.amdCount = 0;
      if (this.system.gpu === 'nvidia' || this.system.gpu === 'hybrid') {
        this.runNvidia(minerPath);
        if (this.system.gpu === 'hybrid') {
          this.runAMD(minerPath);
        }
      } else {
        this.runAMD(minerPath);
      }
    },
    stopMine(toggle = true) {
      this.$store.commit('RESET_MINER_STATUS');
      if (toggle) {
        this.$store.commit('TOGGLE_MINING');
      }
      if (this.system.gpu === 'amd' || this.system.gpu === 'hybrid') {
        // eslint-disable-next-line
        const client = new xgminer('127.0.0.1', '4028');
        client.quit();
      }
      this.system.pids.forEach((pid) => {
        // if (this.platform === 'win32') {
        //   pid += pid;
        // }
        try {
          if (this.platform === 'win32') {
            process.kill(pid, 'SIGINT');
          } else {
            process.kill(pid, 'SIGHUP');
          }
        } catch (e) {
          // eslint-disable-next-line
          console.log(e);
        }
        this.$store.commit('REMOVE_PID', {
          pid,
        });
      });
    },
  },
  created() {
    this.getGpu();
    if ((this.settings.autostart.miner || this.settings.autostart.windows) && !this.system.mining) {
      this.startMine();
    }
  },
};
</script>

<style lang="scss" scoped>
  #wrapper {
    padding: 60px 80px;
  }

  #logo {
    height: 80px;
    width: auto;
    display: block;
    margin: 0 auto 10px;
  }

  .wallet-address {
    margin-top: 50px;
  }

  .donations {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 0.8em;
  }

  .start-mining {
    margin-top: 50px;

    .control {
      margin: 0 auto;
    }
  }
</style>
