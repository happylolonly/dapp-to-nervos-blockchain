import React, { Component } from "react";
import MySimpleTodoContract from "./contracts/MySimpleTodoContract.json";
import getWeb3, { createWeb3 } from "./getWeb3";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
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
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await createWeb3();

      this.web3 = web3;

      // Use web3 to get the user's accounts.
      const accounts = [window.ethereum.selectedAddress];

      const _l2Balance = await web3.eth.getBalance(accounts[0]);
      this.setState({ balance: _l2Balance });

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
    const contract = new this.web3.eth.Contract(MySimpleTodoContract.abi);

    debugger;

    const contract2 = await contract
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
    // toast.success("Contract deployed");
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
    console.log(this.state);
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { deployedContract, todo, balance } = this.state;

    return (
      <div className="App">
        {/* <ToastContainer /> */}
        <h1>Hi!</h1>
        <p>It is my learning TODO smart contract app.</p>
        <p>
          You can deploy contract to network and then use it to store todo! 😄
        </p>

        <p>Balance: {balance}</p>

        <button onClick={() => this.deploy(this.state.accounts[0])}>
          Deploy
        </button>

        {deployedContract && (
          <div>
            <h5>Your contract address: {deployedContract._address}</h5>
            {/* <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p> */}
            <button
              onClick={async () => {
                const value = await this.state.deployedContract.methods
                  .getTodo()
                  .call();

                this.setState({ todo: value });
              }}
            >
              get todo
            </button>
            <button
              onClick={async () => {
                const value = prompt();
                // await this.state.deployedContract.methods.addTodo(value).call();
                await this.state.deployedContract.methods.addTodo(value).send({
                  ...DEFAULT_SEND_OPTIONS,
                  from: this.state.accounts[0],
                });
              }}
            >
              add todo
            </button>

            <button
              onClick={async () => {
                // await this.state.deployedContract.methods.addTodo(value).call();
                await this.state.deployedContract.methods.addTodo("").send({
                  ...DEFAULT_SEND_OPTIONS,
                  from: this.state.accounts[0],
                });
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
