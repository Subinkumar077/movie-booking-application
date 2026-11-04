package com.example.MoviesBookingApplication.service;

import com.example.MoviesBookingApplication.DTO.MovieDTO;
import com.example.MoviesBookingApplication.Entity.Movie;
import com.example.MoviesBookingApplication.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public Movie addMovie(MovieDTO movieDTO) {
        Movie movie = new Movie();
        movie.setName(movieDTO.getName());
        movie.setTitle(movieDTO.getTitle());
        movie.setDescription(movieDTO.getDescription());
        movie.setDuration(movieDTO.getDuration());
        movie.setGenre(movieDTO.getGenre());
        movie.setLanguage(movieDTO.getLanguage());
        movie.setReleaseDate(movieDTO.getReleaseDate());

        return movieRepository.save(movie);
    }


    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> getMovieByGenre(String genre) {
        Optional<List<Movie>> listOfMovieBox = movieRepository.findByGenre(genre);
        if (listOfMovieBox.isPresent()){
            return listOfMovieBox.get();
        }else {
            throw new RuntimeException("No movie found from this genre" + genre);
        }
    }

    public List<Movie> getMovieByLanguage(String language) {
        Optional<List<Movie>> listOfMovieBox = movieRepository.findByLanguage(language);
        if (listOfMovieBox.isPresent()){
            return listOfMovieBox.get();
        }else {
            throw new RuntimeException("No movie found for this language" + language);
        }
    }

    public Movie getMovieByTitle(String title) {
            Optional<Movie> movieBox = movieRepository.findByTitle(title);
        if (movieBox.isPresent()){
            return movieBox.get();
        } else {
            throw new RuntimeException("No movie found for this language: " + title);
        }
    }

    public Movie updateMovie(Long id, MovieDTO movieDTO) {
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new RuntimeException("No movie found for the id: " + id));

        movie.setName(movieDTO.getName());
        movie.setTitle(movieDTO.getTitle());
        movie.setDescription(movieDTO.getDescription());
        movie.setDuration(movieDTO.getDuration());
        movie.setGenre(movieDTO.getGenre());
        movie.setLanguage(movieDTO.getLanguage());
        movie.setReleaseDate(movieDTO.getReleaseDate());

        return movieRepository.save(movie);
    }


    public void deleteMovie(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found with ID: " + id));

        movieRepository.delete(movie);
    }
}
