package com.github.miguelsombrero.osaan.core.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Slf4j
@RestControllerAdvice
class GlobalControllerExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundExceptions(ResourceNotFoundException ex) {
        return createProblemDetail(NOT_FOUND, ex);
    }

    /*@ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericExceptions(Exception ex) {
        return createProblemDetail(INTERNAL_SERVER_ERROR, ex);
    }*/

    private ProblemDetail createProblemDetail(HttpStatus httpStatus, Exception ex) {
        log.error("Returning HTTP status: {}, message: {}", httpStatus, ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatus(httpStatus);
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("timestamp", ZonedDateTime.now());
        return problemDetail;
    }
}