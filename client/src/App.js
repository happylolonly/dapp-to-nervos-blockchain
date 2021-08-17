import React, { Component } from "react";
import MySimpleTodoContract from "./contracts/MySimpleTodoContract.json";
import getWeb3 from "./getWeb3";
import { AddressTranslator } from "nervos-godwoken-integration";
import "./App.css";

const DEFAULT_SEND_OPTIONS = {
  gas: 6000000,
};

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    value: 7,
    deployedContract: null,
    balance: null,
    deploying: false,
    polyjuiceAddress: null,
    contractLoading: false,
    layer2DepositAddress: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      this.web3 = web3;

      const contract = new this.web3.eth.Contract(MySimpleTodoContract.abi);

      this.contract = contract;

      // const contractAddress = "0x5d69c5b7082E928B9169381900a69cc07033B202";

      // this.contract.options.address = contractAddress;

      // Use web3 to get the user's accounts.
      const accounts = [window.ethereum.selectedAddress];

      const addressTranslator = new AddressTranslator();
      const polyjuiceAddress =
        addressTranslator.ethAddressToGodwokenShortAddress(accounts[0]);

      const depositAddress = await addressTranslator.getLayer2DepositAddress(
        web3,
        accounts[0]
      );

      console.log(
        `Layer 2 Deposit Address on Layer 1: \n${depositAddress.addressString}`
      );

      const _l2Balance = await web3.eth.getBalance(accounts[0]);
      this.setState({
        balance: _l2Balance,
        polyjuiceAddress,
        layer2DepositAddress: depositAddress.addressString,
      });

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = MySimpleTodoContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   MySimpleTodoContract.abi,
      //   deployedNetwork && deployedNetwork.address
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: "" }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  deploy = async (fromAddress) => {
    this.setState({ deploying: true });
    try {
      const contract2 = await this.contract
        .deploy({
          data: MySimpleTodoContract.bytecode,
          arguments: [],
        })
        .send({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress,
          to: "0x0000000000000000000000000000000000000000",
        });
      this.setState({ deployedContract: contract2 });
    } catch (error) {
      console.error(error);
    }

    this.setState({ deploying: false });
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(this.state.value).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.getTodo().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    console.log(this.state, this.contract);

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { todo, balance, accounts, contractLoading, layer2DepositAddress } =
      this.state;

    return (
      <div className="App">
        {/* <ToastContainer /> */}
        <h1>Hi!</h1>
        <p>It is my learning TODO smart contract app.</p>
        <p>
          You can deploy contract to Nervos network and then use it to store
          todo! 😄
        </p>

        <br />

        <p>ETH: {this.state.accounts[0]}</p>
        {this.state.polyjuiceAddress && (
          <p>Polyjuice Address: {this.state.polyjuiceAddress}</p>
        )}
        <p>Balance: {balance}</p>

        {layer2DepositAddress && (
          <div
            style={{
              border: "1px solid yellow",
            }}
          >
            <p
              style={{
                wordBreak: "break-all",
              }}
            >
              Layer2 Deposit Address: {layer2DepositAddress}
            </p>
            <p>Use this address as 'Recipient' to fill</p>
            <a
              href="https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              Deposit to Layer2 using Force bridge
            </a>
          </div>
        )}

        <button onClick={() => this.deploy(this.state.accounts[0])}>
          Deploy
        </button>

        <div>
          or use existing address:
          <input
            type="text"
            onChange={({ target: { value } }) => {
              if (value.length === 42) {
                this.contract.options.address = value;
                this.forceUpdate();
              }
            }}
          />
        </div>

        {this.state.deploying && (
          <span>Contract is deploying to Layer 2, please wait...</span>
        )}

        {this.contract.options.address && (
          <div>
            <h5>Your contract address: {this.contract.options.address}</h5>

            {contractLoading && <p>Contract is loading... please wait</p>}

            <button
              onClick={async () => {
                this.setState({ contractLoading: true });

                try {
                  const value = await this.contract.methods.getTodo().call({
                    from: accounts[0],
                  });

                  this.setState({ todo: value });
                } catch (error) {
                  console.error(error);
                }
                this.setState({ contractLoading: false });
              }}
            >
              get todo
            </button>
            <button
              onClick={async () => {
                const value = prompt();
                this.setState({ contractLoading: true });

                try {
                  await this.contract.methods.addTodo(value).send({
                    ...DEFAULT_SEND_OPTIONS,
                    from: accounts[0],
                  });
                } catch (error) {
                  console.error(error);
                }
                this.setState({ contractLoading: false });
              }}
            >
              add todo
            </button>

            <button
              onClick={async () => {
                this.setState({ contractLoading: true });

                try {
                  await this.contract.methods.addTodo("").send({
                    ...DEFAULT_SEND_OPTIONS,
                    from: accounts[0],
                  });
                } catch (error) {
                  console.error(error);
                }
                this.setState({ contractLoading: false });
              }}
            >
              delete todo
            </button>

            {todo && (
              <p>
                Your todo is: <b> {todo} </b>
              </p>
            )}
            {/* <button
              onClick={() => {
                const value = prompt();

                this.setState({ value }, () => {
                  this.runExample();
                });
              }}
            >
              change value
            </button> */}
            {/* <div>The stored value is: {this.state.storageValue}</div> */}
          </div>
        )}
      </div>
    );
  }
}

export default App;
