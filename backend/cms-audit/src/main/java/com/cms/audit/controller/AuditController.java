package com.cms.audit.controller;

import com.cms.audit.model.AuditLog;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuditController {

    @GetMapping("/audit/logs")
    public List<AuditLog> logs() {
        AuditLog l = new AuditLog();
        l.id = "AUDIT-001"; l.timestamp = "2024-01-15T14:30:00Z"; l.actor = "Officer Bekele"; l.actorRole = "Field Officer"; l.action = "CREATE_SEIZURE"; l.entityType = "contraband_item"; l.entityId = "CNB-2024-001"; l.description = "Created new seizure record for cocaine"; l.ipAddress = "192.168.1.100"; l.location = "Addis Ababa, Ethiopia"; l.hash = "a1b2..."; l.verified = true; l.flagged = false; l.metadata = Map.of("quantity","2.5 kg");
        return List.of(l);
    }

    @GetMapping("/reports/templates")
    public List<Map<String,Object>> reportTemplates() {
        return List.of(
                Map.of("id","RPT-001","name","Daily Seizures Report","description","Summary of all seizures in the last 24 hours","type","daily_seizures")
        );
    }
}