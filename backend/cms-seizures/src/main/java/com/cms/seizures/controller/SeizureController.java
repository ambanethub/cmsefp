package com.cms.seizures.controller;

import com.cms.seizures.model.SeizureDetail;
import com.cms.seizures.model.SeizureItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/seizures")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SeizureController {

    private final Map<String, SeizureDetail> store = new ConcurrentHashMap<>();

    public SeizureController() {
        // seed mock data
        SeizureDetail d = new SeizureDetail();
        d.id = "1";
        d.contrabandCode = "CMS-001234";
        d.type = "Drugs";
        d.category = "Cocaine";
        d.description = "White crystalline powder, suspected cocaine";
        d.quantity = 2.5;
        d.unit = "kg";
        d.serialNumber = "N/A";
        d.status = "In Storage";
        d.seizureTime = "2024-01-15T08:30:00";
        d.seizureLocation = Map.of(
                "address", "Bole International Airport, Terminal 2",
                "coordinates", Map.of("lat", 8.9806, "lon", 38.7992)
        );
        d.locationType = "Airport";
        d.seizedBy = "Officer Meron Bekele";
        d.agency = "Ethiopian Federal Police";
        d.assignedStorage = "Warehouse A - Section B2";
        d.notes = "Found hidden in false bottom of suitcase during routine customs inspection.";
        d.photos = List.of("/cocaine-evidence.png", "/suitcase-false-bottom.png", "/airport-seizure.png");
        d.documents = List.of(
                Map.of("name", "Seizure Report.pdf", "size", "2.3 MB", "type", "pdf"),
                Map.of("name", "Lab Analysis Request.docx", "size", "156 KB", "type", "docx")
        );
        d.custodyHistory = List.of(
                Map.of("id", "1", "action", "Seizure Registered", "actor", "Officer Meron Bekele", "timestamp", "2024-01-15T08:30:00", "location", "Bole Airport", "notes", "Initial seizure and registration"),
                Map.of("id", "2", "action", "Transfer Approved", "actor", "Supervisor Alemayehu Tadesse", "timestamp", "2024-01-15T09:15:00", "location", "Bole Airport", "notes", "Approved transfer to central warehouse")
        );
        d.integrityHash = "sha256:a1b2c3d4e5f6...";
        d.verificationStatus = "Verified";
        d.caseNumber = "CASE-2024-0156";
        d.relatedCases = List.of("CASE-2024-0155", "CASE-2024-0157");
        store.put(d.id, d);
    }

    @GetMapping
    public List<SeizureItem> list() {
        List<SeizureItem> items = new ArrayList<>();
        for (SeizureDetail d : store.values()) {
            SeizureItem i = new SeizureItem();
            i.id = d.id;
            i.contrabandCode = d.contrabandCode;
            i.type = d.type;
            i.category = d.category;
            i.quantity = d.quantity;
            i.unit = d.unit;
            i.status = d.status;
            i.seizureTime = d.seizureTime;
            i.seizedBy = d.seizedBy;
            i.location = String.valueOf(d.seizureLocation.get("address"));
            i.assignedStorage = d.assignedStorage;
            i.photos = d.photos != null ? d.photos.size() : 0;
            i.hasDocuments = d.documents != null && !d.documents.isEmpty();
            items.add(i);
        }
        return items;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeizureDetail> get(@PathVariable String id) {
        SeizureDetail detail = store.get(id);
        return detail == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(detail);
        }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@RequestBody Map<String, Object> payload) {
        String id = String.valueOf(Instant.now().toEpochMilli());
        SeizureDetail d = new SeizureDetail();
        d.id = id;
        d.contrabandCode = "CMS-" + id.substring(id.length() - 6);
        d.type = String.valueOf(payload.getOrDefault("contrabandType", "Unknown"));
        d.category = String.valueOf(payload.getOrDefault("category", "Uncategorized"));
        try {
            d.quantity = Double.parseDouble(String.valueOf(payload.getOrDefault("quantity", "0")));
        } catch (Exception e) {
            d.quantity = 0;
        }
        d.unit = String.valueOf(payload.getOrDefault("unit", "units"));
        d.serialNumber = String.valueOf(payload.getOrDefault("serialNumber", "N/A"));
        d.status = "Registered";
        d.seizureTime = String.valueOf(payload.getOrDefault("seizureTime", Instant.now().toString()));
        Object locObj = payload.get("location");
        String address = "";
        if (locObj instanceof Map<?, ?> map) {
            Object addrVal = map.get("address");
            if (addrVal == null) addrVal = "";
            address = String.valueOf(addrVal);
        }
        d.seizureLocation = Map.of("address", address);

        d.locationType = String.valueOf(payload.getOrDefault("locationType", "Unknown"));
        d.seizedBy = String.valueOf(payload.getOrDefault("seizedBy", ""));
        d.agency = String.valueOf(payload.getOrDefault("agency", ""));
        d.assignedStorage = String.valueOf(payload.getOrDefault("storageAssignment", ""));
        d.notes = String.valueOf(payload.getOrDefault("notes", ""));
        d.photos = List.of();
        d.documents = List.of();
        d.custodyHistory = List.of();
        d.integrityHash = "sha256:seed";
        d.verificationStatus = "Pending";
        d.caseNumber = "CASE-" + id.substring(id.length()-4);
        d.relatedCases = List.of();

        store.put(d.id, d);
        return ResponseEntity.ok(Map.of("id", id, "contrabandCode", d.contrabandCode));
    }
}