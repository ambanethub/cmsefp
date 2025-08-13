package com.cms.inventory.model;

public class StorageLocation {
    public String id;
    public String name;
    public String address;
    public String type; // Warehouse, Evidence Room, Temporary, Secure Vault
    public int capacity;
    public int currentItems;
    public String status; // Active, Maintenance, Full, Inactive
    public String lastAudit;
    public String manager;
    public String contact;
}