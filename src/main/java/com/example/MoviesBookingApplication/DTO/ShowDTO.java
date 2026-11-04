package com.example.MoviesBookingApplication.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ShowDTO {
    private LocalDateTime showTime;
    private Double price;

    private Long movieId;
    private Long theaterId;

}
