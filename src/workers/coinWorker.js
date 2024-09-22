let coinCount = 0;

onmessage = function (e) {
  if (e.data === 'collectCoin') {
    coinCount++;
    if (coinCount % 3 === 0) {
      postMessage({ coinCount, lifeGained: true });
    } else {
      postMessage({ coinCount, lifeGained: false });
    }

    if (coinCount % 5 === 0) {
      const bonus = 'extraPoints'; 
      postMessage({ coinCount, bonus });
    }
  }
};
