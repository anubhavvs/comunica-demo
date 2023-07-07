import './style.css';
import { initialFetch } from './initialData';
import { searchQuery } from './searchQuery';

document.querySelector('#submit').addEventListener('click', () => {
  const searchData = document.querySelector('input[type="text"]').value;
  console.log(searchData);
  if (searchData !== '') searchQuery(searchData, 'actor');
});

initialFetch();
searchQuery('Emma Watson', 'actor');
