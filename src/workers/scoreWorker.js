self.onmessage = (event) => {
  if (event.data === 10) {
    self.postMessage(10); 
  }
};

