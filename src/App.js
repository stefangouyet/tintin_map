import React, {Component,useEffect} from 'react';
import MapGL, {Marker,Popup} from 'react-map-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


//https://fontawesome.com/icons/map-pin
import {faMapMarker} from '@fortawesome/free-solid-svg-icons';

import SideBar from './side-bar';

import tintinData from "./tintin_data.json";

import styles from './App.css';

// const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN

class App extends Component {
  
  state = {
      viewport: {
        latitude: 20,
        longitude: 0,
        zoom: 1.5,
        bearing: 0,
        pitch: 0,
        minZoom:1.5
      },
      startTime: 1930,
      endTime: 1989,
      selectedYear: 1989,
      language: 'en',
      selectedLocation: null
    };

 

  componentDidMount() {
    this.setState({
      data: tintinData
    })
  }

  mapRef = React.createRef();

  filterYear = (data, year) => {
    const features = data.features.filter(feature => {
      console.log(parseInt(feature.properties.Year,10))
      return (
        parseInt(feature.properties.Year,10) <= parseInt(year,10) //=== year
      )})
      return {type: 'FeatureCollection', features};
  }

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };
  
  handleTimeChange = event => {

    this.setState({
      selectedYear: parseInt(event.target.value,10),
      data: this.filterYear(tintinData,parseInt(event.target.value,10)), 
    })
  };

  // useEffect(function updateMapLanguage() {
  //   map.getLayer()
  // }

  // useEffect(() =>  
  // mapRef.addControl()
  
  // )

  render() {
    const {viewport, data, selectedYear, startTime, endTime, selectedLocation} = this.state;

    return (
      <div style={{height:"100vh"}}> 
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          ref = {this.mapRef}
          mapStyle="mapbox://styles/stefangouyet/ckck1kga92ird1irumuxg4ni1"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onClick={() => this.setState({ selectedLocation: null })}
        >
          {data && data.features.map(location =>
          
            <Marker
            key = {location.properties.EN_Location + location.properties['Year Completed']}
            latitude={location.geometry.coordinates[1]}
            longitude={location.geometry.coordinates[0]}
            >
              <FontAwesomeIcon 
              icon={faMapMarker} 
              size='1x' 
              color='#007CB6' 
              onClick={e => {
                          e.preventDefault();
                          this.setState({selectedLocation:location})
          }}
              />
            
            </Marker>
          )}

            { selectedLocation ? (
              
            <Popup
            className='popup'
            tipSize={5}
            anchor="top"
            latitude={selectedLocation.geometry.coordinates[1]}
            longitude={selectedLocation.geometry.coordinates[0]}
            closeOnClick={false}
            onClose={() => this.setState({selectedLocation: null})}>
              <button className='button'>
                  <h3>{selectedLocation.properties['EN_Location']}</h3>
                  <img 
                  className='photo' 
                  //src={require('./images/' + selectedLocation.properties['FR_Name'].toString() + '.jpeg')} 
                  src = {"https://storage.googleapis.com/tintin-map.appspot.com/images/"+ selectedLocation.properties['FR_Name'].toString().replace(' ','%20').replace('Î','I%CC%82').replace('é','e%CC%81').replace('É','E%CC%81') + '.jpeg'}
                  />
                  <h3>{selectedLocation.properties['Year Completed']}</h3>
              </button>
            </Popup>
          ) : null
        }

        </MapGL>
        <SideBar
          containerComponent={this.props.containerComponent}
          startTime={startTime}
          endTime={endTime}
          selectedTime={selectedYear}
          onChangeDay={this.handleTimeChange}
        />
      </div>
    );
  }
}

export default App;