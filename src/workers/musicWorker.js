self.onmessage = function (e) {
  const { action} = e.data;
  switch (action) {
    case "play":
      self.postMessage("play");
      break;
    case "stop":
      self.postMessage("stop");
      break;
    case "pause":
      self.postMessage("pause");
    break;
  }
};
