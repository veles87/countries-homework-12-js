import './sass/main.scss';

var debounce = require('lodash.debounce');

import { alert, error,defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';

  
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';



const refs = {
    form: document.querySelector('#form'),
    input: document.querySelector('input'),
    container: document.querySelector('.container')
}

const handlerInput = (e) => {
    e.preventDefault()
    clearCountriesContainer()
    const name = refs.input.value;
    fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then(response => response.json())
    .then(country => {
        if (country.length > 10) {
            defaultModules.set(PNotifyMobile, {});
            error({
                text: 'Too many matches found. Please enter a more specific query.'
            });
        };
        if (country.length > 1 && country.length <= 10) {
            renderCountriesCollection(country);
        }
        if (country.length === 1) {
            renderCountry(country);
        }
        if (country.status === 404) {
            clearContent ()
            error({
                text: "404 Not found"})
        }
        
  })
    .catch(arr => {
        clearContent ()
        defaultModules.set(PNotifyMobile, {});
        error({
        text: '404 Not found'
    });})
}

refs.form.addEventListener('input', debounce(handlerInput, 1000));


function createCountry (obj) {
const article =  ` 
<article class ="country">
<h1 class ="country-name"><b>${obj.name}</b></h1>
<div class ="country-container">
  <div class ="country-info">
  <p> <b>Capital:</b> ${obj.capital}</p>
  <p> <b>Population:</b> ${obj.population}</p>
<ul > <b>Languages:</b>
  <li> ${obj.languages.map(languag =>languag.name)}</li>
</ul>
</div>
<div class ="country-flag">
  <img src ="${obj.flag}" alt ="${obj.demonym}" width = "300px">
</div>
</div>
</article>
`
refs.container.insertAdjacentHTML('beforeend', article)
}

function renderCountry (arr) {
    arr.forEach(el => createCountry(el))
}

function createCountriesCollection (obj) {
  const article = `
  <li class="countries-collection">${obj.name}</li>
  `
  refs.container.insertAdjacentHTML('beforeend', article)
}

function renderCountriesCollection (arr) {
    arr.forEach(el => createCountriesCollection(el))
}

function clearCountriesContainer () {
    refs.container.innerHTML = '';
}

function clearContent(){
    refs.input.value = ''; 
  }
