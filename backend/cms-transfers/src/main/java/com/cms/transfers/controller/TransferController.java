package com.cms.transfers.controller;

import com.cms.transfers.model.Transfer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/transfers")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TransferController {

    private final Map<String, Transfer> store = new ConcurrentHashMap<>();

    public TransferController() {
        Transfer t = new Transfer();
        t.id = "1"; t.contrabandCode = "CMS-001234"; t.contrabandType = "Drugs"; t.fromLocation = "Bole Airport"; t.toLocation = "Warehouse A"; t.requestedBy = "Officer Meron Bekele"; t.requestedAt = "2024-01-15T08:30:00"; t.approvedBy = "Supervisor Alemayehu Tadesse"; t.approvedAt = "2024-01-15T09:15:00"; t.receivedBy = "Warehouse Manager Dawit Haile"; t.receivedAt = "2024-01-15T11:30:00"; t.status = "Completed"; t.reason = "Initial storage after seizure"; t.urgency = "Normal";
        store.put(t.id, t);
    }

    @GetMapping
    public List<Transfer> list() { return new ArrayList<>(store.values()); }

    @GetMapping("/{id}")
    public ResponseEntity<Transfer> get(@PathVariable String id) {
        Transfer t = store.get(id);
        return t == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(t);
    }

    @PostMapping
    public Map<String, String> create(@RequestBody Transfer body) {
        String id = String.valueOf(Instant.now().toEpochMilli());
        body.id = id;
        if (body.status == null || body.status.isBlank()) body.status = "Pending";
        store.put(id, body);
        return Map.of("id", id);
    }
}