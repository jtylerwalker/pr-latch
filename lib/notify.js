const notifier = require("node-notifier");
const path = require("path");

class Notify {
  constructor(title, message, wait) {
    this.title = title;
    this.message = message;
    this.wait = wait;
  }

  init() {
    notifier.notify({
      title: this.title,
      message: this.message,
      icon: path.join(__dirname, "../assets/check-mark.png"),
      wait: this.wait
    });
  }
}

module.exports = Notify;
