// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract MySimpleTodoContract {
  string storedData;

  mapping(address => string) public todos;

  function addTodo( string memory todo) public {
    todos[msg.sender] = todo;
    // storedData = todo;
  }

  function getTodo() public view returns (string memory) {
    return todos[msg.sender];
    // return storedData;
  }
}
