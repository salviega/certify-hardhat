import dotenv from 'dotenv'
import fs from 'fs'
import { HardhatUserConfig } from 'hardhat/config'
import path from 'path'

import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

const envFile =
	process.env.NODE_ENV === 'production' ? '.env.production' : '.env.testnet'

if (fs.existsSync(path.resolve(__dirname, envFile))) {
	dotenv.config({ path: envFile })
} else {
	dotenv.config()
}

const {
	ALCHEMY_ARBITRUM_HTTPS,
	ARBISCAN_API_KEY,
	COINMARKETCAP_API_KEY,
	REPORT_GAS,
	WALLET_PRIVATE_KEY
} = process.env

if (!ALCHEMY_ARBITRUM_HTTPS) {
	throw new Error('ALCHEMY_ARBITRUM_HTTPS is not set')
}

if (!ARBISCAN_API_KEY) {
	throw new Error('ARBISCAN_API_KEY is not set')
}

if (!COINMARKETCAP_API_KEY) {
	throw new Error('COINMARKETCAP_API_KEY is not set')
}

if (!WALLET_PRIVATE_KEY) {
	throw new Error('WALLET_PRIVATE_KEY is not set')
}

const ACCOUNTS = [WALLET_PRIVATE_KEY]

const SOLC_SETTING = {
	optimizer: {
		enabled: true,
		runs: 200
	}
}

const defaultNetwork = 'hardhat'
const config: HardhatUserConfig = {
	defaultNetwork,
	networks: {
		hardhat: {
			allowUnlimitedContractSize: true,
			chainId: 1337
		},
		localhost: {
			allowUnlimitedContractSize: true,
			chainId: 1337,
			url: 'http://localhost:8545'
		},
		arbitrumOne: {
			chainId: 42161,
			accounts: ACCOUNTS,
			url: ALCHEMY_ARBITRUM_HTTPS
		},
		arbitrumSepolia: {
			chainId: 421614,
			accounts: ACCOUNTS,
			url: ALCHEMY_ARBITRUM_HTTPS
		}
	},
	etherscan: {
		apiKey: ARBISCAN_API_KEY
	},
	sourcify: {
		enabled: true
	},
	namedAccounts: {
		deployer: {
			default: 0
		}
	},
	solidity: {
		compilers: [
			{
				version: '0.8.24',
				settings: SOLC_SETTING
			},
			{
				version: '0.8.23',
				settings: SOLC_SETTING
			},
			{
				version: '0.8.22',
				settings: SOLC_SETTING
			},
			{
				version: '0.8.21',
				settings: SOLC_SETTING
			},
			{
				version: '0.8.20',
				settings: SOLC_SETTING
			},
			{
				version: '0.8.19',
				settings: SOLC_SETTING
			}
		]
	},
	gasReporter: {
		enabled: !!REPORT_GAS,
		coinmarketcap: COINMARKETCAP_API_KEY,
		currency: 'USD',
		L2: 'arbitrum'
		// outputFile: 'gas-report.txt'
	},

	mocha: {
		timeout: 200000
	}
}

export default config
