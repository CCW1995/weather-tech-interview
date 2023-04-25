import React from 'react'
import { GoSearch } from 'react-icons/go'
import { BsFillTrash2Fill } from 'react-icons/bs'

import CloudPng from '../assets/cloud.png'
import SunPng from '../assets/sun.png'

function WeatherCard({
  mode,
  weatherData,
  searchHistory,
  onClickSearch,
  onClickDelete
}) {

  return (
    <div 
      className={ `weather-card-bg ${ mode === 'light' ? 'weather-card-bg-light' : 'weather-card-bg-dark' }` }
      style={{ position: 'relative' }}
    >
      <img src={ CloudPng } className={ 'weather-card-bg-img' }/>
      <img src={ SunPng } className={ 'weather-card-bg-img' }/>
      <span>
        Today's Weather
      </span>
      <div className="weather-card_info-cont">
        <div className='weather-card_left-info'>
          <h1>
            { `${ Math.round( weatherData.main.temp ) }°` }
          </h1>
          <span>
            { `H: ${ Math.round( weatherData.main.temp_max ) }°, L: ${ Math.round( weatherData.main.temp_min ) }°`}
          </span>
          <strong>
            { `${ weatherData?.name }, ${ weatherData?.sys?.country??'' }` }
          </strong>
        </div>
        <div className="weather-card_right-info">
          <span>
            { `${ weatherData.datetime }`}
          </span>
          <span>
            { `Humidity: ${ weatherData.main.humidity }`}
          </span>
          <span>
            {
              `${ weatherData.weather?.[0].main }`
            }
          </span>
        </div>
      </div>
      <div className="weather-card_search-form">
        <span className="weather-card_search-history-label">
          Search History
        </span>
        {
          searchHistory.length < 1 && (
            <span>
              No history found
            </span>
          )
        }
        {
          searchHistory.length > 0 &&
          searchHistory.map( historyChild => (
            <div key={ historyChild.id } className="weather-card_search-form-child-card">
              <div className="weather-card_search-form-child-label-cont">
                <span className='weather-card_search-form-child-name-label'>{ historyChild.name }</span>
                <span className='weather-card_search-form-child-datetime-label'>{ historyChild.datetime }</span>
              </div>
              <div className="weather-card_search-form-child-card-action-cont"> 
                <button
                  className='weather-card_search-form-child-card-action'
                  onClick={ () => onClickSearch( historyChild )}
                >
                  <GoSearch/>
                </button>
                <button
                  className='weather-card_search-form-child-card-action'
                  onClick={ () => onClickDelete( historyChild )}
                >
                  <BsFillTrash2Fill/>
                </button>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default WeatherCard