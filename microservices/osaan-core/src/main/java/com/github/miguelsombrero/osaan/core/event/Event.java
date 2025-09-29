package com.github.miguelsombrero.osaan.core.event;

import lombok.Getter;

import java.time.ZonedDateTime;

@Getter
public class Event<K, T> {

    public enum Type {
        SKILL_CREATED
    }

    private final Type eventType;
    private final K key;
    private final T data;
    private final ZonedDateTime created;

    public Event() {
        this.eventType = null;
        this.key = null;
        this.data = null;
        this.created = null;
    }

    public Event(Type eventType, K key, T data) {
        this.eventType = eventType;
        this.key = key;
        this.data = data;
        this.created = ZonedDateTime.now();
    }
}
