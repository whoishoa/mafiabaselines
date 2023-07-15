import logo from './logo.svg';
import './App.css';
import {
  init, SUPPORTED_ETHEREUM_NETWORKS, THEME, signIn,
  WALLET_PROVIDER, getRamperSigner, getWalletModel
} from '@ramper/ethereum'
import { ethers } from 'ethers'

const alchemy = new ethers.providers.AlchemyProvider(80001, 'pEWvHrkSkkyWGZmezdGMk_LjYu8DAx1k')


init({
  appName: 'EVM Test App',
  appId: '12345678',
  authProviders: [
    "google"
  ],
  walletProviders: [WALLET_PROVIDER.METAMASK],
  network: SUPPORTED_ETHEREUM_NETWORKS.MATICMUM,
  theme: THEME.DARK,
})



function App() {

  const handleSignTransactionWithRamperSigner = async () => {
    await signIn()
    const wallet = getWalletModel(window.localStorage, "ethereum")

    const signer = await getRamperSigner(alchemy)

    const value = ethers.utils.parseEther('0.0000001')
    const gasLimit = await alchemy.estimateGas({
      to: '0xa419dfa199Df8651c3f4476546AF5E4CC4E0F73F',
      value,
    })
    const feeData = await alchemy.getFeeData()

    try {
      const result = await signer.signTransaction({
        type: 2,
        from: wallet.publicKey,
        to: '0xa419dfa199Df8651c3f4476546AF5E4CC4E0F73F',
        value,
        chainId: 80001,
        nonce: alchemy.getTransactionCount(wallet.publicKey),
        gasLimit: gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      })

      console.log('signTransaction result: ', result)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={() => { handleSignTransactionWithRamperSigner() }}>
          Handle Sign Transaction
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
