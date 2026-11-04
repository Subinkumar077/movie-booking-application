package com.example.MoviesBookingApplication.controller;

import com.example.MoviesBookingApplication.DTO.ShowDTO;
import com.example.MoviesBookingApplication.Entity.Show;
import com.example.MoviesBookingApplication.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show")
public class ShowController {
    @Autowired
    private ShowService showService;

    @PostMapping("/createshow")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> createShow(@RequestBody ShowDTO showDTO){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(showService.createShow(showDTO));
    }

    @GetMapping("/getallshows")
    public ResponseEntity<List<Show>> getAllShows(){
        return ResponseEntity.ok(showService.getAllShows());
    }

    @GetMapping("/getshowbymovie/{id}")
    public ResponseEntity<List<Show>> getShowByMovie(@PathVariable Long id){
        return ResponseEntity.ok(showService.getShowByMovie(id));
    }
    @GetMapping("/getshowbytheater/{id}")
    public ResponseEntity<List<Show>> getShowByTheater(@PathVariable Long id){
        return ResponseEntity.ok(showService.getShowByTheater(id));
    }

    @PutMapping("/updateshow/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @RequestBody ShowDTO showDTO){
        return ResponseEntity.ok(showService.updateShow(id, showDTO));
    }

    @DeleteMapping("/deleteshow/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id){
        showService.deleteShow(id);

        return  ResponseEntity.noContent().build();
    }

}
