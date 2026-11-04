package com.example.MoviesBookingApplication.service;

import com.example.MoviesBookingApplication.DTO.TheaterDTO;
import com.example.MoviesBookingApplication.Entity.Movie;
import com.example.MoviesBookingApplication.Entity.Theater;
import com.example.MoviesBookingApplication.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheaterService {

    @Autowired
    private TheaterRepository theaterRepository;
    public Theater addTheater(TheaterDTO theaterDTO) {
        Theater theater = new Theater();
        theater.setTheaterLocation(theaterDTO.getTheaterLocation());
        theater.setTheaterCapacity(theaterDTO.getTheaterCapacity());
        theater.setTheaterName(theaterDTO.getTheaterName());
        theater.setTheaterScreenType(theaterDTO.getTheaterScreenType());

        return theaterRepository.save(theater);
    }

    public List<Theater> getTheaterByLocation(String location) {
        Optional<List<Theater>> listOfTheaterBox = theaterRepository.findByTheaterLocation(location);
        if (listOfTheaterBox.isPresent()){
            return listOfTheaterBox.get();
        }else {
            throw new RuntimeException("No theater found for this location: " + location);
        }
    }

    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }

    public Theater updateTheater(Long id, TheaterDTO theaterDTO) {
        Theater theater = theaterRepository.findById(id).orElseThrow(() -> new RuntimeException("No theater found for this location"));

        theater.setTheaterLocation(theaterDTO.getTheaterLocation());
        theater.setTheaterCapacity(theaterDTO.getTheaterCapacity());
        theater.setTheaterName(theaterDTO.getTheaterName());
        theater.setTheaterScreenType(theaterDTO.getTheaterScreenType());

        return theaterRepository.save(theater);
    }

    public void deleteTheater(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("theater not found: " + id));
        theaterRepository.deleteById(id);
    }
}
