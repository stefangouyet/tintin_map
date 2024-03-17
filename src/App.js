import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import MapGL, { Marker, Popup } from "react-map-gl";
import "./App.css";
import TimelineComponent from './Timeline';
import tintinData from "./tintin_data.json";

class App extends Component {
  state = {
    viewport: {
      latitude: 20,
      longitude: 0,
      zoom: 1,
      bearing: 0,
      pitch: 0,
      minZoom: 0.5,
    },
    startTime: 1930,
    endTime: 1989,
    selectedYear: 1989,
    language: "en",
    selectedBook: null,
    popupLocation: null
  };

  componentDidMount() {
    this.setState({
      data: tintinData,
    });
  }

  onMapRefChange = node => {
    this.setState({ mapRef: node });
  };

  mapRef = React.createRef();
  clusterHeight = 32;
  clusterWidth = 24;
  uniqueBooks = tintinData.features.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.properties.EN_Name === current.properties.EN_Name)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  filterYear = (data, year) => {
    const features = data.features.filter((feature) => {
      return (
        parseInt(feature.properties.Year, 10) <= parseInt(year, 10)
      );
    });
    return { type: "FeatureCollection", features };
  };

  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };

  handleTimeChange = (event) => {
    this.setState({
      selectedYear: parseInt(event.target.value, 10),
      data: this.filterYear(tintinData, parseInt(event.target.value, 10)),
    });
  };

  handleSelectedBookClick = (book) => {
    this.setState({
      selectedBook: book,
      popupLocation: null
    })
  }

  handleMarkerClick = (e, book) => {
    e.preventDefault();
    this.setState({
      popupLocation: book,
      selectedBook: this.uniqueBooks.find(o => o.properties.EN_Name === book.properties.EN_Name)
    });

    document.getElementById(book.properties.EN_Name).scrollIntoView({ behavior: 'smooth' })
  }

  handleMapClick = () => {
    this.setState({ selectedBook: null, popupLocation: false })
  }

  handleSetHoverBook = (book) => {
    if (book) {
      this.setState({ hoverBook: book.properties.EN_Name });
    } else {
      this.setState({ hoverBook: null });
    }
  }

  handlePopupClose = () => {
    this.setState({ popupLocation: null })
  }

  render() {
    const {
      viewport,
      data,
      selectedBook,
      popupLocation
    } = this.state;
    return (
      <div style={{ height: "100vh" }} className='app'>
        <div className='bottomBar'>
          <div className="flexRow">
            <TimelineComponent data={this.uniqueBooks} selectedBook={selectedBook}
              handleSelectedBookClick={this.handleSelectedBookClick}
              handleSetHoverBook={this.handleSetHoverBook}
              hoverBook={this.state.hoverBook} />
          </div>
        </div>
        <div className='map'>

          <MapGL
            {...viewport}
            width="100%"
            height="100%"
            // ref={this.mapRef}
            ref={this.onMapRefChange}
            mapStyle="mapbox://styles/stefangouyet/ckck1kga92ird1irumuxg4ni1"
            onViewportChange={this.handleViewportChange}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onClick={this.handleMapClick}
          >
            {data &&
              data.features.map((book) => (
                <div style={{
                  zIndex: book.properties.EN_Name === selectedBook?.properties.EN_Name ? 10000 : 0
                }}>
                  <Marker
                    key={
                      book.properties.EN_Location +
                      book.properties["Year Completed"]
                    }
                    latitude={book.geometry.coordinates[1]}
                    longitude={book.geometry.coordinates[0]}
                    offsetTop={-this.clusterHeight}
                    offsetLeft={-this.clusterWidth / 2}
                    style={{
                      zIndex: book.properties.EN_Name === selectedBook?.properties.EN_Name || book.properties.EN_Name === this.state.hoverBook ? 1000 : 0
                    }}
                    className={book.properties.EN_Name === selectedBook?.properties.EN_Name ? 'mapboxGlMarkerHovered' : undefined}
                  >
                    <FontAwesomeIcon
                      icon={faMapMarker}
                      size="2x"
                      color={book.properties?.EN_Location === popupLocation?.properties?.EN_Location ? 'darkblue' : book.properties.EN_Name === selectedBook?.properties.EN_Name || book.properties.EN_Name === this.state.hoverBook ? 'red' : "#007CB6"}
                      onClick={(e) => this.handleMarkerClick(e, book)}
                      className='map-marker'
                      style={{
                        zIndex: book.properties.EN_Name === selectedBook?.properties.EN_Name ? 1000 : 0
                      }}
                    />
                  </Marker>
                </div>
              ))}

            {this.state.popupLocation && (
              <Popup
                className="popup"
                tipSize={5}
                anchor="top"
                latitude={popupLocation?.geometry.coordinates[1]}
                longitude={popupLocation?.geometry.coordinates[0]}
                closeOnClick={false}
                closeButton={false}
                onClose={this.handlePopupClose}
                style={{}}
              >
                <span>{popupLocation?.properties["EN_Location"]}</span>
              </Popup>
            )}
          </MapGL>

        </div>
      </div>
    );
  }
}

export default App;
