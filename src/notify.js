const notifier = require("node-notifier");
const path = require("path");

class Notify {
  constructor(title, message, wait) {
    this.title = title;
    this.message = message;
    this.wait = wait;

    //this.clickHandler = this.clickHandler.bind(this);
    //this.timeoutHandler = this.timeoutHandler.bind(this);
  }

  init() {
    notifier.notify({
      title: this.title,
      message: this.message,
      icon: path.join(__dirname, "../assets/check-mark.png"),
      wait: this.wait
    });

    //notifier.on("click", this.clickHandler);
    //notifier.on("timeout", this.timeoutHandler);
  }
}

module.exports = Notify;
