self.onmessage = (event) => {
    if (event.data.lives <= 0) {
      self.postMessage({ lives: 0, gameOver: true });
    } else {
      self.postMessage({ lives: event.data.lives, gameOver: false });
    }
  };
  