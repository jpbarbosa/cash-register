module.exports = function checkCashRegister(price, cash, cid) {
  const currencyUnits = [
    ['ONE HUNDRED', 100],
    ['FIFTY', 50],
    ['TWENTY', 20],
    ['TEN', 10],
    ['FIVE', 5],
    ['ONE', 1],
    ['QUARTER', 0.25],
    ['DIME', 0.1],
    ['NICKEL', 0.05],
    ['PENNY', 0.01],
  ];

  const cidSum = parseFloat(cid.reduce((a, b) => a + b[1], 0).toFixed(2));

  let dueBalance = parseFloat((cash - price).toFixed(2));
  let status = 'OPEN';
  let change = [];

  if (cidSum < dueBalance) {
    return {
      status:
        'INSUFFICIENT_FUNDS',
      change
    };
  }

  if (cidSum === dueBalance) {
    status = 'CLOSED';
  }

  console.log('----------------------------------------------------------------');
  console.log({ price, cash, dueBalance });

  for (let i in currencyUnits) {
    const [currencyUnitName, currencyUnitValue] = currencyUnits[i];
    const currencyFound = cid.find(currency => currency[0] === currencyUnitName);

    if (currencyFound && currencyUnitValue < dueBalance) {
      const [, currencyFoundValue] = currencyFound;

      if (currencyFoundValue === 0) {
        continue;
      }

      const maxChangePossible = Math.floor(dueBalance / currencyUnitValue) * currencyUnitValue;
      const value = (maxChangePossible > currencyFoundValue) ? currencyFoundValue : maxChangePossible;
      change.push([currencyUnitName, value])
      dueBalance = parseFloat((dueBalance - value).toFixed(2));

      console.log({ currencyUnitName, value, dueBalance })
    }
  }

  const changeSum = parseFloat(change.reduce((a, b) => a + b[1], 0).toFixed(2));

  if (changeSum < dueBalance) {
    return {
      status:
        'INSUFFICIENT_FUNDS',
      change: []
    };
  }

  return {
    status,
    change
  }
}
