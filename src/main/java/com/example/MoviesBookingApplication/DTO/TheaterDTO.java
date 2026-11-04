package com.example.MoviesBookingApplication.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TheaterDTO {
    private String theaterName;
    private String theaterLocation;
    private int theaterCapacity;
    private String theaterScreenType;
}
