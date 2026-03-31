package com.example.haybalertracker;

import java.util.Date;

public class Bale {
    private int id;
    private String type;
    private double length;
    private double width;
    private double height;
    private double weight;
    private String notes;
    private double latitude;
    private double longitude;
    private Date timestamp;
    private String fieldName;

    // Default constructor
    public Bale() {
        this.timestamp = new Date();
    }

    // Parameterized constructor
    public Bale(String type, double length, double width, double height, double weight,
                String notes, double latitude, double longitude, String fieldName) {
        this.type = type;
        this.length = length;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.notes = notes;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fieldName = fieldName;
        this.timestamp = new Date();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
}