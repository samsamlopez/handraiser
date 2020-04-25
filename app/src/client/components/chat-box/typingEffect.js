import React, { PureComponent } from "react";
import "./typingEffect.scss";

class TypingEffect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="typing-indicator">
        <span />
        <span />
        <span />
      </div>
    );
  }
}

export default TypingEffect;