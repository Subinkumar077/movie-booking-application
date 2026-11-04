package com.example.MoviesBookingApplication.controller;

import com.example.MoviesBookingApplication.DTO.BookingDTO;
import com.example.MoviesBookingApplication.Entity.Booking;
import com.example.MoviesBookingApplication.Entity.BookingStatus;
import com.example.MoviesBookingApplication.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.MoviesBookingApplication.Entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/createbooking")
    public ResponseEntity<Booking> createBooking (@RequestBody BookingDTO bookingDTO){
        Booking booking = bookingService.createBooking(bookingDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/getuserbooking")
    public ResponseEntity<List<Booking>> getUserBooking(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(bookingService.getUserBooking(user.getId()));
    }

    @GetMapping("/getshowbooking/{id}")
    public ResponseEntity<List<Booking>> getShowBooking(@PathVariable Long id){
        return  ResponseEntity.ok(bookingService.getShowBooking(id));
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @GetMapping("/status/{bookingStatus}")
    public ResponseEntity<List<Booking>> getBookingByStatus(@PathVariable BookingStatus bookingStatus){
        return ResponseEntity.ok(bookingService.getBookingByStatus(bookingStatus));
    }




}
