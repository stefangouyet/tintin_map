import * as React from 'react';
import {PureComponent} from 'react';

export default class ControlPanel extends PureComponent {
  render() {
    const {startTime, endTime, onChangeDay, allDay, onChangeAllDay, selectedTime} = this.props;
    const day = 24 * 60 * 60 * 1000;
    const days = Math.round((endTime - startTime) / day);

    const _onChangeDay = evt => {
      const daysToAdd = evt.target.value;
      // add selected days to start time to calculate new time
      const newTime = startTime + daysToAdd * day;
      onChangeDay(newTime);
    };

    const formatTime = time => {
      const date = new Date(time);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
      <div className="control-panel">
        <h3>Les Adventures de Tintin</h3>
        <hr />
        <div className="input">
          <label>FR / EN</label>
          <input
            type="checkbox"
            name="allday"
            checked={allDay}
            onChange={evt => onChangeAllDay(evt.target.checked)}
          />
        </div>
        <div>
       
          <label>Year: 1930 - {selectedTime}</label>
          <input
            type="range"
            id = 'slider'
            //disabled={allDay}
            min={1930}
            max={1989}
            step={1}
            defaultValue={this.selectedTime}
            onChange={onChangeDay}
          />
        </div>
        
        <hr/>
        <i>Note: Fictional locations are approximate/guessed based on factors</i>
      </div>
    );
  }
}
