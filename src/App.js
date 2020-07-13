import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import ControlPanel from './control-panel';
import {json as requestJson} from 'd3-request';
import {heatmapLayer} from './map-style';

import styles from './App.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3RlZmFuZ291eWV0IiwiYSI6ImNrNzlqbm8ycTA5bXUzbXFyMWZreGMxb24ifQ.hGYafiv-Xt5DXaUZgz4M8Q'

function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter(feature => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return {type: 'FeatureCollection', features};
}

class App extends Component {
  constructor(props) {
    super(props);
    const current = new Date().getTime();

    this.state = {
      viewport: {
        latitude: 40,
        longitude: -100,
        zoom: 3,
        bearing: 0,
        pitch: 0
      },
      allDay: false,
      startTime: current,
      endTime: current,
      selectedTime: current,
      earthquakes: null
    };

    

    this._handleChangeDay = this._handleChangeDay.bind(this);
    this._handleChangeAllDay = this._handleChangeAllDay.bind(this);
  }

  mapRef = React.createRef();

  componentDidMount() {
    requestJson(
      'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      (error, response) => {
        if (!error) {
          // Note: In a real application you would do a validation of JSON data before doing anything with it,
          // but for demonstration purposes we ingore this part here and just trying to select needed data...
          const features = response.features;
          const endTime = features[0].properties.time;
          const startTime = features[features.length - 1].properties.time;

          this.setState({
            data: response,
            earthquakes: response,
            endTime,
            startTime,
            selectedTime: endTime
          });
        }
      }
      
    );
  }

  _onViewportChange = viewport => this.setState({viewport});

  _handleChangeDay = time => {
    this.setState({selectedTime: time});
    if (this.state.earthquakes) {
      this.setState({data: filterFeaturesByDay(this.state.earthquakes, time)});
    }
  };

  _handleChangeAllDay = allDay => {
    this.setState({allDay});
    if (this.state.earthquakes) {
      this.setState({
        data: allDay
          ? this.state.earthquakes
          : filterFeaturesByDay(this.state.earthquakes, this.state.selectedTime)
      });
    }
  };

  render() {
    const {viewport, data, allDay, selectedTime, startTime, endTime} = this.state;

    return (
      // <div style={{height: '100%', position: 'relative'}}>
      <div style={{height:"100vh"}}> 
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          ref = {this.mapRef}
          mapStyle="mapbox://styles/stefangouyet/ckck1kga92ird1irumuxg4ni1"
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          
        >
          {data && (
            <Source type="geojson" data={data}>
              <Layer {...heatmapLayer} />
            </Source>
          )}
        </MapGL>
        <ControlPanel
          containerComponent={this.props.containerComponent}
          startTime={startTime}
          endTime={endTime}
          selectedTime={selectedTime}
          allDay={allDay}
          onChangeDay={this._handleChangeDay}
          onChangeAllDay={this._handleChangeAllDay}
        />
      </div>
    );
  }
}

export default App;