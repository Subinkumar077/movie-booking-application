package com.example.MoviesBookingApplication.DTO;

import com.example.MoviesBookingApplication.Entity.BookingStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class BookingDTO {

    private Integer noOfSeats;
    private Double price;
    private LocalDateTime bookingTime;
    private BookingStatus bookingStatus;

    private List<String> seatNumbers;
    private Long userId;
    private Long showId;


}
