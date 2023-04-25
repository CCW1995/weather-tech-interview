import { useState, useEffect, useRef } from 'react'
import {
  Button,
  UncontrolledTooltip
} from 'reactstrap'
import _ from 'lodash'
import uniqid from 'uniqid'
import Moment from 'moment'
import { GrPowerReset } from 'react-icons/gr'
import { GoSearch } from 'react-icons/go'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

import SearchField from './components/SearchField';
import WeatherCard from './components/WeatherCard';
import { getFromCookie, updateCookie, deleteCookie } from './utils/cookie'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BGLight from './assets/bg-light.png'
import BGDark from './assets/bg-dark.png'
import './index.scss'

const cookieName = `weather_history`

function App() {  
  const [ rawCountries, setRawCountries ] = useState( [] )
  const [ countries, setCountries ] = useState( [] )
  const [ cities, setCities ] = useState( [] )
  const [ selectCountry, setSelectedCountry ] = useState( '' )
  const [ selectCity, setSelectedCity ] = useState( '' )
  const [ weatherData, setWeatherData ] = useState( null )
  const [ searchHistory, setSearchHistory ] = useState( [] )
  const [ mode, setMode ] = useState( 'light' )
  const [ searchError, setSearchError ] = useState( false )

  const contEnd = useRef( null )

  useEffect(() => {
    const tempCookieVal = getFromCookie( cookieName )
    setSearchHistory( tempCookieVal )

    fetch( `https://countriesnow.space/api/v0.1/countries` )
    .then( res => res.json() )
    .then( val => {
      let tempData = _.map( val.data, child => child.country )
      tempData = _.orderBy( tempData )
      setCountries( tempData )
      setRawCountries( val.data )
    })
    .catch( err => console.error( err ))
  }, [])

  const onSearchWeather = val => {
    fetch( `https://api.openweathermap.org/data/2.5/weather?q=${ val }&appid=207be5c3f730e48a74f44dbc2e9e4d79&units=metric` )
    .then( res => res.json() )
    .then( val => {
      if ( val?.cod === '404' ){
        setWeatherData( null )
        return setSearchError( true )
      } 

      let temp = [
        ... searchHistory,
        { 
          id: uniqid(),
          country: selectCountry,
          city: val.name,
          name: `${ val?.name }, ${ val?.sys?.country??'' }`, 
          datetime: Moment().format( 'DD-MM-YYYY hh:mm a' )
        }
      ]
      setSearchHistory( temp )
      setSearchError( false )
      updateCookie( cookieName, temp )
      setWeatherData({
        ... val,
        datetime: Moment().format( 'DD-MM-YYYY hh:mm a' )
      })
      contEnd.current.scrollIntoView({ behavior: 'smooth' })
    })
    .catch( err => console.error( err ))
  }

  useEffect(() => {
    if ( selectCountry ){
      let tempCityIndex = _.findIndex( rawCountries, { country: selectCountry })

      tempCityIndex > -1 && 
      setCities( rawCountries[ tempCityIndex ]?.cities??[] )
    }
  }, [ selectCountry ])

  return (
    <div 
      className='p-4 overflow-scroll'
      style={{ 
        backgroundImage: `url(${ mode === 'light' ? BGLight : BGDark })`, height: '100vh',
        position: 'relative'
      }}
    >
      <div className='weather-card-main-cont'>
        <div className="weather-card-search-cont">
          <SearchField
            label={ 'Country' }
            mode={ mode }
            options={ countries }
            value={ selectCountry }
            onChangeField={ val => {
              setSelectedCountry( val )
            }}
          />
          <SearchField
            label={ 'City' }
            options={ cities }
            mode={ mode }
            value={ selectCity }
            onChangeField={ val => setSelectedCity( val )}
          />
          <div className="d-flex mt-3">
            <Button 
              color={ 'primary' }
              style={{ 
                background: mode === 'dark' ? '#28124D' : '#6C40B5',
                borderColor: mode === 'dark' ? '#28124D' : '#6C40B5',
                marginRight: 10
              }}
              disabled={ !selectCity }
              onClick={ () => onSearchWeather( selectCity )}
            >
              <GoSearch id={ 'mode_switcher' }/>
            </Button>
            <UncontrolledTooltip target={ `mode_switcher` }>
              { mode === 'dark' ? 'Dark Mode' : 'Light Mode' }
            </UncontrolledTooltip>
            <Button 
              color={ 'danger' }
              onClick={ () => {
                setSelectedCity( '' )
                setSelectedCountry( '' )
                setCities( [] )
                setWeatherData( null )
              }}
            >
              <GrPowerReset style={{ filter: 'invert(1)' }}/>
            </Button>
            <Button
              style={{ marginLeft: 'auto' }}
              onClick={ () => setMode( prev => prev === 'light' ? 'dark' : 'light' )}
            >
              {
                mode === 'light' ? <MdLightMode/> : <MdDarkMode/>
              }
            </Button>
          </div>
        </div>
        {
          weatherData && (
            <WeatherCard
              mode={ mode }
              weatherData={ weatherData }
              searchHistory={ searchHistory }
              onClickSearch={ ( val ) => {
                setSelectedCity( val.city )
                setSelectedCountry( val.country )
                onSearchWeather( val.city )
              }}
              onClickDelete={ val => {
                let temp = _.cloneDeep( searchHistory )
                let tempIndex = _.findIndex( temp, { id: val.id })
                temp.splice( tempIndex, 1 )

                setSearchHistory( temp )
                updateCookie( cookieName, temp )
              }}
            />
          )
        }
        {
          !weatherData && searchError && (
            <div className="card p-4 text-center mt-4">
              Record Not Found.
            </div>
          )
        }

      </div>
      <div ref={ contEnd }/>
    </div>
  );
}

export default App;
