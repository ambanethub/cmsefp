package com.cms.transfers.model;

public class Transfer {
    public String id;
    public String contrabandCode;
    public String contrabandType;
    public String fromLocation;
    public String toLocation;
    public String requestedBy;
    public String requestedAt;
    public String approvedBy;
    public String approvedAt;
    public String receivedBy;
    public String receivedAt;
    public String status; // Pending, Approved, In Transit, Completed, Rejected
    public String reason;
    public String urgency; // Normal, Urgent
    public String notes;
}