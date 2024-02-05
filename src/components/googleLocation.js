import React, { useEffect, useRef, useState } from 'react';
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
let autoComplete;
const loadScript= (url, callback)=>{
    let script= document.createElement('script');
    script.type='text/javascript';

    if(script.readyState){
        script.onreadystatechange=function(){
            if(script.readyState === 'loaded' || script.readyState==="complete")
            {
                script.onreadystatechange= null;
                callback()
            }
        }
    } else {
        script.onload=()=>callback();
    }
    script.src =url;
    document.getElementsByTagName('head')[0].appendChild(script);
} 

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: `${theme.spacing(1)} 0`,
  }));
const SearchLocationInput = ({setSelectedLocation}) => {
    const [query, setQuery] = useState("");
    const autoCompleteRef = useRef(null);
    const handlePlaceSelect=(updateQuery)=>{
        const addressObject=autoComplete.getPlace();
        const query= addressObject.formatted_address;
        updateQuery(query);
        console.log({query});
        const latLng= {
            lat: addressObject?.geometry?.location?.lat(),
            lng: addressObject?.geometry?.location?.lng()
        }
        console.log(latLng)
        setSelectedLocation(latLng)
    }
    const handleSriptLoad =(updateQuery, autoCompleteRef)=>{
        autoComplete=new window.google.maps.places.Autocomplete(
            autoCompleteRef.current,{
                // types:['(cities)'],
                componentRestrictions: {country: "IN"}
            }
        )
        autoComplete.addListener('place_changed',()=>{
            handlePlaceSelect(updateQuery);
        })
    }
    useEffect(()=>{
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&v=3.exp&libraries=places`,
            ()=>handleSriptLoad(setQuery, autoCompleteRef)
        );
    },[])
    return (
        <div className='main-container'>
            {/* <input
                style={{     margin: "16px",
                    width: "40vw",
                    height: "20px",
                    fontSize: "14px"
                     }}
                ref={autoCompleteRef}
                placeholder='Search Places ...'
                onChange={(e) => setQuery(e.target.value)}
                value={query}
            /> */}

             <StyledTextField
              label="Search Location"
              fullWidth
              inputRef={autoCompleteRef}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />

        </div>
    );
};

export default SearchLocationInput;