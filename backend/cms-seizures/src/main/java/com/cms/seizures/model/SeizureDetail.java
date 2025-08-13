package com.cms.seizures.model;

import java.util.List;
import java.util.Map;

public class SeizureDetail {
    public String id;
    public String contrabandCode;
    public String type;
    public String category;
    public String description;
    public double quantity;
    public String unit;
    public String serialNumber;
    public String status;
    public String seizureTime;
    public Map<String, Object> seizureLocation; // address, coordinates
    public String locationType;
    public String seizedBy;
    public String agency;
    public String assignedStorage;
    public String notes;
    public List<String> photos;
    public List<Map<String, String>> documents; // name, size, type
    public List<Map<String, String>> custodyHistory;
    public String integrityHash;
    public String verificationStatus;
    public String caseNumber;
    public List<String> relatedCases;
}