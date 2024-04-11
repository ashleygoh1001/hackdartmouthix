import $ from 'jquery';
import './style.scss';

// used to look at setInterval: https://www.w3schools.com/jsref/met_win_setinterval.asp
let num = 0;

setInterval(() => {
  num++;
  $('#main').html(`You've been on this page for ${num} seconds`);
}, 1000);
