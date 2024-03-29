export const abiQtumGov = [
  {
    inputs: [],
    name: "setInitialAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProposalToAdd",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "onVote",
            type: "bool",
          },
          {
            internalType: "address[]",
            name: "votes",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "proposal",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "proposalHeight",
            type: "uint256",
          },
        ],
        internalType: "struct QtumGov.addressProposal",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "__validatorContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "__poaContractAddress",
        type: "address",
      },
    ],
    name: "setContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_adminAddress",
        type: "address",
      },
    ],
    name: "isAdminKey",
    outputs: [
      {
        internalType: "bool",
        name: "isAdmin",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_govAddress",
        type: "address",
      },
    ],
    name: "isGovKey",
    outputs: [
      {
        internalType: "bool",
        name: "isGov",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proposalAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "addAddressProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proposalAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "removeAddressProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalUint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "changeValueProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "getAddressesList",
    outputs: [
      {
        internalType: "address[]",
        name: "vals",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "getRequiredVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "val",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_type2",
        type: "uint256",
      },
    ],
    name: "getCurrentOnVoteStatus",
    outputs: [
      {
        internalType: "bool",
        name: "val",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_type2",
        type: "uint256",
      },
    ],
    name: "getCurrentOnVoteVotes",
    outputs: [
      {
        internalType: "address[]",
        name: "vals",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_type2",
        type: "uint256",
      },
    ],
    name: "getCurrentOnVoteAddressProposal",
    outputs: [
      {
        internalType: "address",
        name: "val",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "getCurrentOnVoteValueProposal",
    outputs: [
      {
        internalType: "uint256",
        name: "val",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_reqBlockHeight",
        type: "uint256",
      },
    ],
    name: "getParamsForBlock",
    outputs: [
      {
        internalType: "address",
        name: "paramsAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_paramIndex",
        type: "uint256",
      },
    ],
    name: "getParamAddressAtIndex",
    outputs: [
      {
        internalType: "address",
        name: "paramsAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_paramIndex",
        type: "uint256",
      },
    ],
    name: "getParamHeightAtIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "paramsHeight",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getParamCount",
    outputs: [
      {
        internalType: "uint256",
        name: "paramsCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
