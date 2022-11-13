import { CssBaseline,Grid } from "@material-ui/core";


import { getPlacesData } from './APIS';
import React, { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Maps from "./components/Map/Maps";

const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setfilteredPlaces] = useState([]);

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
  

    const [coordinates, setCoordinates] = useState({});
    const [childClicked, setChildClicked] = useState(null);
    const [bounds, setBounds] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
            setCoordinates({lat: latitude, lng: longitude});
        })
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((places) => places.rating > rating)
        setfilteredPlaces(filteredPlaces)
    }, [rating])

    useEffect(() =>{
        if(bounds.sw && bounds.ne) {
            setIsLoading(true);

            getPlacesData(type, bounds.sw, bounds.ne)
               .then((data) => {
                  setPlaces(data?.filter((places) => places.name && places.num_reviews > 0));
                  setfilteredPlaces([])
                  setIsLoading(false)
               })

        }
     
    }, [type,coordinates, bounds]);

    return (
        <div>
           <CssBaseline />
           <Header setCoordinates={setCoordinates} />
           <Grid container spacing={3} style= {{ width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                     places={filteredPlaces.length ? filteredPlaces : places}
                     childClicked={childClicked}
                     isLoading={isLoading}
                     type={type}
                     setType={setType}
                     rating={rating}
                     setRating={setRating}
                    />

                </Grid>
                <Grid item xs={12} md={8}>
                    <Maps
                    setCoordinates={setCoordinates}
                    setBounds={setBounds} 
                    coordinates={coordinates}
                    places={filteredPlaces.length ? filteredPlaces : places}
                    setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default App;