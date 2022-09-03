'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display balance to DOM
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${acc.balance} €`;
};

//display summary of in and out movements
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1 && interest)
    //jonas used .filter(interest => interest >= 1);
    .reduce((acc, interest) => acc + interest, 0);

  //if interest > 1
  labelSumInterest.textContent = `${interest} €`;
};

//create usernames in account obj
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements from function written above
  displayMovements(acc.movements);

  //display balance from function written above
  calcDisplayBalance(acc);

  //display summary from function written above
  calcDisplaySummary(acc);
};

//Event Handlers

//LOGIN TO ACCOUNT
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //updates ui
    updateUI(currentAccount);
  } //  WRITE ELSE BLOCK THAT DISPLAYS ERR MSG ON WRONG DETAILS LATER
});

//TRANSFER CASH
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update ui
    updateUI(currentAccount);
  }
});

//LOAN CASH
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov => amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`==========================forEach`);
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

////////////////////////////////////////MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const checkDogs = function (dogsJulia, dogskate) {
// console.log(dogsJulia);
//   const newDogsJulia = dogsJulia.slice();
//   newDogsJulia.pop();
//   newDogsJulia.shift();
//   const totalArr = [...newDogsJulia, ...dogskate];
//   // console.log(totalArr);
//   totalArr.forEach(function (dog, i, totalArr) {
//     dog >= 3
//       ? console.log(`Dog number ${i + 1} is an adult and is ${dog} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log(`=================================`);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//TEST DATA
//1: julias data [3, 5, 2, 12, 7], kates data [4, 1, 15, 8, 3]
//2: julias data [9, 16, 6, 8, 3], kates data [10, 5, 6, 1, 4]
// const checkDogs = function (dogsJulia, dogskate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   // console.log(dogsJuliaCorrected);
//   const dogs = dogsJuliaCorrected.concat(dogskate);
//   // console.log(dogs);
//   dogs.forEach(function (dog, i, dogs) {
//     dog >= 3
//       ? console.log(`Dog number ${i + 1} is an adult and is ${dog} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log(`=================================`);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

////////////////////////////FILTER METHOD WITHDRAWALS & DEPOSITS
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// const withdrawals = movements.filter(mov => mov < 0);

///////////////////////////REDUCE METHOD ACCOUNT BALANCE
// const balance = movements.reduce(
//   (accumulator, curr, i, arr) => accumulator + curr,
//   0
// );

// maximum value of array with reduce
// const max = movements.reduce((acc, curr, i, arr) => {
//   if (acc > curr) return acc;
//   else return curr;
// }, movements[0]);
// console.log(max);

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const owners = ['jonas', 'zach', 'adam', 'martha'];
// console.log(owners.sort());

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

// console.log(movements);

// const x = new Array(7);
// console.log(x);

// const y = Array.from({ length: 7 }, (curr, i, arr) => i + 1);
// console.log(y);

// const y = Array.from({ length: 100 }, (curr, i, arr) => {
//   return Math.floor(Math.random() * 100) + 1;
// });
// console.log(y);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });
