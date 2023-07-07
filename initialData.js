import { CountUp } from 'countup.js';

export const initialFetch = async () => {
  let response = await fetch(`${URL}stats`);
  let countData = await response.json();

  var countUpFilms = new CountUp('movie_target', countData.filmCount, {
    duration: 4,
  });
  countUpFilms.start();

  var countUpActors = new CountUp('actor_target', countData.actorCount, {
    duration: 4,
  });
  countUpActors.start();

  var countUpDirectors = new CountUp(
    'director_target',
    countData.directorCount,
    { duration: 4 }
  );
  countUpDirectors.start();

  var countUpGenres = new CountUp('genre_target', countData.genreCount, {
    duration: 4,
  });
  countUpGenres.start();
};
