import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./test/artifacts",
    cache: "./test/cache",
    sources: "./test/contracts"
  },
  typechain: {
    outDir: './test/typechain-types', // Specify your custom directory here
    target: 'hardhat',
  },
};

export default config;
