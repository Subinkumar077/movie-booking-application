package com.example.MoviesBookingApplication.controller;

import com.example.MoviesBookingApplication.DTO.TheaterDTO;
import com.example.MoviesBookingApplication.Entity.Theater;
import com.example.MoviesBookingApplication.service.TheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theater")
public class TheaterController {

    @Autowired
    private TheaterService theaterService;

    //ConstructorInjection
    /*private final TheaterService theaterService;

    public TheaterController(TheaterService theaterService) {
        this.theaterService = theaterService;
    }*/

    @PostMapping("/addtheater")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Theater> addTheater(@RequestBody TheaterDTO theaterDTO){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(theaterService.addTheater(theaterDTO));
    }

    @GetMapping("/gettheaterbylocation")
    public ResponseEntity<List<Theater>> getTheaterByLocation(@RequestParam String location){
        return ResponseEntity.ok(theaterService.getTheaterByLocation(location));
    }

    @GetMapping("/getalltheaters")
    public ResponseEntity<List<Theater>> getAllTheaters(){
        return ResponseEntity.ok(theaterService.getAllTheaters());
    }

    @PutMapping("/updatetheater/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Theater> updateTheater(@PathVariable Long id, @RequestBody TheaterDTO theaterDTO){
        return ResponseEntity.ok(theaterService.updateTheater(id, theaterDTO));
    }

    @DeleteMapping("/deletetheater/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long id){
        theaterService.deleteTheater(id);
            return ResponseEntity.noContent().build();
    }


}
