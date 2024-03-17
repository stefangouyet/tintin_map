import * as React from "react";
import { PureComponent } from "react";

export default class SideBar extends PureComponent {
  render() {
    const { onChangeDay, selectedTime } = this.props;

    return (
      <div className="sidebar">
        <h3>Les Adventures de Tintin</h3>
        {/* <hr /> */}
        {/* <div>
          <label>Year: 1930 - {selectedTime}</label>
          <input
            type="range"
            id="slider"
            min={1930}
            max={1989}
            step={1}
            defaultValue={selectedTime}
            value={selectedTime}
            onChange={onChangeDay}
          />
        </div> */}

        {/* <hr /> */}
        <i>Note: Fictional locations are approximate</i>
      </div>
    );
  }
}
