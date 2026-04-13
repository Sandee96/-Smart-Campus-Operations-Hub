package com.studentcampus.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.studentcampus.app.model.BookingStatus;

@Data
public class AdminActionDto {
    @NotNull
    private BookingStatus action; // APPROVED or REJECTED
    private String note;
}
