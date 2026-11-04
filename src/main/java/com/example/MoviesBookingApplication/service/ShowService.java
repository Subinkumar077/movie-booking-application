package com.example.MoviesBookingApplication.service;

import com.example.MoviesBookingApplication.DTO.ShowDTO;
import com.example.MoviesBookingApplication.Entity.Booking;
import com.example.MoviesBookingApplication.Entity.Movie;
import com.example.MoviesBookingApplication.Entity.Show;
import com.example.MoviesBookingApplication.Entity.Theater;
import com.example.MoviesBookingApplication.repository.MovieRepository;
import com.example.MoviesBookingApplication.repository.ShowRepository;
import com.example.MoviesBookingApplication.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private TheaterRepository theaterRepository;

    public Show createShow(ShowDTO showDTO) {
        Movie movie = movieRepository.findById(showDTO.getMovieId()).orElseThrow(() -> new RuntimeException("Movie not found " +showDTO.getMovieId()));

        Theater theater = theaterRepository.findById(showDTO.getTheaterId()).orElseThrow(()-> new RuntimeException("No theater found " + showDTO.getTheaterId()));
        Show show = new Show();
        show.setShowTime(showDTO.getShowTime());
        show.setPrice(showDTO.getPrice());
        show.setMovie(movie);
        show.setTheater(theater);
        return showRepository.save(show);
    }

   

    public Show updateShow(Long id, ShowDTO showDTO) {
        Show show= showRepository.findById(id).orElseThrow(()-> new RuntimeException("No show available for the id" + id));

        Movie movie = movieRepository.findById(showDTO.getMovieId()).orElseThrow(() -> new RuntimeException("Movie not found " +showDTO.getMovieId()));

        Theater theater = theaterRepository.findById(showDTO.getTheaterId()).orElseThrow(()-> new RuntimeException("No theater found " + showDTO.getTheaterId()));
        show.setShowTime(showDTO.getShowTime());
        show.setPrice(showDTO.getPrice());
        show.setMovie(movie);
        show.setTheater(theater);
        return showRepository.save(show);
    }

    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)){
            throw new RuntimeException("No show available " + id);
        }
        List<Booking> bookings = showRepository.findById(id).get().getBookings();
        if (!bookings.isEmpty()){
            throw new RuntimeException("Can't delete show with existing bookings");
        }

        showRepository.deleteById(id);
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public List<Show> getShowByMovie(Long movieId) {
        Optional<List<Show>> showListBox = showRepository.findByMovieId(movieId);
        if (showListBox.isPresent()){
            return showListBox.get();
        } else {
            throw new RuntimeException("No show is available "+ movieId);
        }
    }

    public List<Show> getShowByTheater(Long theaterId) {
        Optional<List<Show>> showListBox = showRepository.findByTheaterId(theaterId);
        if (showListBox.isPresent()){
            return showListBox.get();
        } else {
            throw new RuntimeException("No show is available "+ theaterId);
        }
    }
}
