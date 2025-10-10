package com.github.miguelsombrero.osaan.core.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class ControllerTraceLoggerAspect {

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerClassMethods() {
    }

    @Before("controllerClassMethods()")
    public void logMethodEntry(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        log.trace("➡️ Entering {} with arguments: {}", methodName, Arrays.toString(args));
    }

    @AfterReturning(pointcut = "controllerClassMethods()", returning = "result")
    public void logMethodExit(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().toShortString();
        log.trace("⬅️ Exiting {} with result: {}", methodName, result);
    }

    @AfterThrowing(pointcut = "controllerClassMethods()", throwing = "ex")
    public void logMethodException(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().toShortString();
        log.error("💥 Exception in {}: {}", methodName, ex.getMessage(), ex);
    }
}
