package com.github.miguelsombrero.osaan.core.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.time.ZonedDateTime;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
class GlobalControllerExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.NotFound.class)
    public ProblemDetail handleNotFoundExceptions(HttpClientErrorException.NotFound ex) {
        return createProblemDetail(NOT_FOUND, ex);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundExceptions(ResourceNotFoundException ex) {
        return createProblemDetail(NOT_FOUND, ex);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ProblemDetail handleHttpClientErrorExceptionExceptions(HttpClientErrorException ex) {
        return createProblemDetail(BAD_REQUEST, ex);
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericExceptions(Exception ex) {
        return createProblemDetail(INTERNAL_SERVER_ERROR, ex);
    }

    private ProblemDetail createProblemDetail(HttpStatus httpStatus, Exception ex) {
        log.error("Returning HTTP status: {}, message: {}", httpStatus, ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatus(httpStatus);
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("timestamp", ZonedDateTime.now());
        return problemDetail;
    }
}