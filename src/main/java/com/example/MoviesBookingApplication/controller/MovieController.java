
package com.example.MoviesBookingApplication.controller;

import com.example.MoviesBookingApplication.DTO.MovieDTO;
import com.example.MoviesBookingApplication.Entity.Movie;
import com.example.MoviesBookingApplication.service.MovieService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Add a new movie
    @PostMapping("/addmovies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> addMovie(
            @RequestBody MovieDTO movieDTO) {

        Movie movie = movieService.addMovie(movieDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(movie);
    }

    // Get all movies
    @GetMapping("/getallmovies")
    public ResponseEntity<List<Movie>> getAllMovies() {

        List<Movie> movies = movieService.getAllMovies();

        return ResponseEntity.ok(movies);
    }

    // Get movies by genre
    @GetMapping("/getmoviesbygenre")
    public ResponseEntity<List<Movie>> getMovieByGenre(
            @RequestParam String genre) {

        List<Movie> movies = movieService.getMovieByGenre(genre);

        return ResponseEntity.ok(movies);
    }

    @GetMapping("getmoviesbylanguage")
    public ResponseEntity<List<Movie>> getMovieByLanguage(@RequestParam String language){
        List<Movie> movies  = movieService.getMovieByLanguage(language);

        return  ResponseEntity.ok(movies);
    }
    @GetMapping("getmoviesbytitle")
    public ResponseEntity<Movie> getMovieByTitle(@RequestParam String title){
        Movie movie = movieService.getMovieByTitle(title);
        return  ResponseEntity.ok(movie);
    }

    @PutMapping("updatemovie/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody MovieDTO movieDTO){
        return ResponseEntity.ok(movieService.updateMovie(id, movieDTO));
    }

    @DeleteMapping("deletemovie/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id){
            movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
