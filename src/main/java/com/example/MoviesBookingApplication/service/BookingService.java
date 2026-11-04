package com.example.MoviesBookingApplication.service;

import com.example.MoviesBookingApplication.DTO.BookingDTO;
import com.example.MoviesBookingApplication.Entity.Booking;
import com.example.MoviesBookingApplication.Entity.BookingStatus;
import com.example.MoviesBookingApplication.Entity.Show;
import com.example.MoviesBookingApplication.Entity.User;
import com.example.MoviesBookingApplication.repository.BookingRepository;
import com.example.MoviesBookingApplication.repository.ShowRepository;
import com.example.MoviesBookingApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private UserRepository userRepository;


    public Booking createBooking(BookingDTO bookingDTO) {
        Show show = showRepository.findById(bookingDTO.getShowId()).orElseThrow(()-> new RuntimeException("Show not found"));
        if (!isSeatsAvailable(show.getId(), bookingDTO.getNoOfSeats())){
            throw new RuntimeException("Not enough seats are available");
        }

        if (bookingDTO.getSeatNumbers().size() != bookingDTO.getNoOfSeats()){
            throw new RuntimeException("seat numbers and numbers of seats must be equal");
        }
        validateDuplicateSeats(show.getId(), bookingDTO.getSeatNumbers());

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setNoOfSeats(bookingDTO.getNoOfSeats());
        booking.setBookingStatus(bookingDTO.getBookingStatus());
        booking.setBookingTime(bookingDTO.getBookingTime());
        booking.setPrice(calculateTotalAmount(show.getPrice(), bookingDTO.getNoOfSeats()));
        booking.setSeatNumbers(bookingDTO.getSeatNumbers());

        return bookingRepository.save(booking);

    }

    public boolean isSeatsAvailable(Long showid, Integer numberOfSeats){
        Show show = showRepository.findById(showid)
                .orElseThrow(()-> new RuntimeException("Show not found"));
        int bookedSeats = show.getBookings().stream()
                .filter(booking -> booking.getBookingStatus() != BookingStatus.CANCELLED)
                .mapToInt(Booking::getNoOfSeats)
                .sum();

        return (show.getTheater().getTheaterCapacity() - bookedSeats) >= numberOfSeats;

    }

    public void validateDuplicateSeats(Long showId, List<String> seatNumbers){
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Set<String> occupiedSeats = show.getBookings().stream()
                .filter(b->b.getBookingStatus() != BookingStatus.CANCELLED)
                .flatMap(b->b.getSeatNumbers().stream())
                .collect(Collectors.toSet());


        List<String> duplicateSeats = seatNumbers.stream()
                .filter(occupiedSeats::contains)
                .collect(Collectors.toList());
        if(!duplicateSeats.isEmpty()){
            throw  new RuntimeException("seats are already booked");
        }
    }

    public Double calculateTotalAmount(double price, Integer numberOfSeats){
        return price * numberOfSeats;
    }

    public List<Booking> getUserBooking(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getShowBooking(Long showId) {
        return bookingRepository.findByShowId(showId);
    }

    public List<Booking> getBookingByStatus(BookingStatus bookingStatus) {
        return bookingRepository.findByBookingStatus(bookingStatus);
    }


    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getBookingStatus() !=  BookingStatus.PENDING){
            throw new RuntimeException("Booking is not in pending state");
        }

        //Payment process
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);

    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        validateCancellations(booking);
        booking.setBookingStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
    public void validateCancellations(Booking booking){
        LocalDateTime showTime = booking.getShow().getShowTime();
        LocalDateTime deadlineTime = showTime.minusHours(2);

        if (LocalDateTime.now().isAfter(deadlineTime)){
            throw new RuntimeException("Cannot cancel the booking");
        }
        if(booking.getBookingStatus()== BookingStatus.CANCELLED){
            throw new RuntimeException("Booking is already cancelled");
        }
    }
}
