import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer, Marker,Popup} from 'react-map-gl';
import ControlPanel from './control-panel';
import {json as requestJson} from 'd3-request';
import {heatmapLayer} from './map-style';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import MapboxLanguageControl from 'react-mapbox-gl-language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMapMarker} from '@fortawesome/free-solid-svg-icons';

import tintin from "./tintin_data.json";

import styles from './App.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3RlZmFuZ291eWV0IiwiYSI6ImNrNzlqbm8ycTA5bXUzbXFyMWZreGMxb24ifQ.hGYafiv-Xt5DXaUZgz4M8Q'

class App extends Component {
  
  state = {
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: 2,
        bearing: 0,
        pitch: 0,
        minZoom:1.5
      },
      startTime: 1930,
      endTime: 1989,
      selectedTime: 1930,
      earthquakes: null,
      selectedLocation: null
    };

 

  componentDidMount() {
    console.log(tintin.features)
    this.setState({
      data: tintin,
      earthquakes:tintin
    })
    console.log(this.state.data)
  }

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };


  render() {
    const {viewport, data, selectedTime, startTime, endTime, selectedLocation} = this.state;

    return (
      // <div style={{height: '100%', position: 'relative'}}>
      <div style={{height:"100vh"}}> 
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          ref = {this.mapRef}
          mapStyle="mapbox://styles/stefangouyet/ckck1kga92ird1irumuxg4ni1"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onClick={() => this.setState({ selectedLocation: null })}
        >
          {data && data.features.map(location =>
            <Marker
            key = {location.properties.EN_Location}
            latitude={location.geometry.coordinates[1]}
            longitude={location.geometry.coordinates[0]}
            >
              <FontAwesomeIcon 
              icon={faMapMarker} 
              size='1x' 
              color='black' 
              onClick={e => {
                          e.preventDefault();
                          this.setState({selectedLocation:location})
          }}
              />
            
            </Marker>
          )}

            { selectedLocation ? (
            <Popup
            latitude={selectedLocation.geometry.coordinates[1]}
            longitude={selectedLocation.geometry.coordinates[0]}
            closeOnClick={false}
            onClose={() => this.setState({selectedLocation: null})}>
              <button className='button'>
                  <h1>{selectedLocation.properties['EN_Name']}</h1>
                  <h3>{selectedLocation.properties['Year']}</h3>
                  {/* <img 
                  className='photo' 
                  src={require('./images/'+selectedBuilding.properties['Building Name'] + '.jpg')} 
                  alt='./images/general_deco.jpg'  /> */}
                  
              </button>
            </Popup>
          ) : null
        }

        </MapGL>
        <ControlPanel
          containerComponent={this.props.containerComponent}
          startTime={startTime}
          endTime={endTime}
          selectedTime={selectedTime}
          //allDay={allDay}
          // onChangeDay={this._handleChangeDay}
          // onChangeAllDay={this._handleChangeAllDay}
        />
      </div>
    );
  }
}

export default App;