package com.cms.inventory.model;

public class InventoryItem {
    public String id;
    public String contrabandCode;
    public String type;
    public String location;
    public String status; // Present, Missing, Discrepancy, In Transit
    public String lastSeen;
    public String assignedDate;
}