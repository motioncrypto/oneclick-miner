# motion-miner

> Motion miner with just one click - Nvidia and AMD over Windows.

#### NVIDIA ADVISE

- Currently only works with CUDA 9.1 drivers. Please update your drivers [http://www.nvidia.com/Download/index.aspx](here)

#### To do

- [X] Custom pools
- [X] AMD Graphics support (beta)
- [ ] Integration with Pools API

#### Troubleshootings

**I do not have a Motion Address**

Please download and install our wallet from [https://motionproject.org](Motion website), then generate a new Motion Address.

**AMD Graphics is cycling and never start to mine**

Please update your drivers.

**Just open a CMD window and stays black**

Please update your drivers.

**Miner crashes with cuda error `cuda_check_cpu_setTarget`**

Please underclock your cards.

#### Development

``` bash
# install dependencies
npm install
-or-
yarn

# serve with hot reload at localhost:9080
npm run dev
-or-
yarn dev

# build electron application for production
npm run build
-or-
yarn build

# lint all JS/Vue component files in `src/`
npm run lint
-or-
yarn lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[1c165f7](https://github.com/SimulatedGREG/electron-vue/tree/1c165f7c5e56edaf48be0fbb70838a1af26bb015) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

Inside works with [Z-Enemy Miner](https://bitcointalk.org/index.php?topic=3378390.0;all) and [Suprminer](https://github.com/ocminer/suprminer) for nVidia. [Avermore](https://github.com/brian112358/avermore-miner) and [SGMiner-kl](https://github.com/KL0nLutiy/sgminer-kl/releases) for AMD.