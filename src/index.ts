import { Viewer } from './viewer';

require('./index.css');

const element = document.createElement('div');
element.className = 'container';
document.body.appendChild(element);

const viewer = new Viewer(element);
