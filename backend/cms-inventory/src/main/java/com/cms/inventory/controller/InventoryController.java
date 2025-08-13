package com.cms.inventory.controller;

import com.cms.inventory.model.AuditEvent;
import com.cms.inventory.model.InventoryItem;
import com.cms.inventory.model.StorageLocation;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class InventoryController {

    private final List<StorageLocation> locations = new ArrayList<>();
    private final List<InventoryItem> items = new ArrayList<>();
    private final Map<String, List<AuditEvent>> auditByLocation = new HashMap<>();

    public InventoryController() {
        StorageLocation a = new StorageLocation();
        a.id = "1"; a.name = "Warehouse A"; a.address = "Industrial Zone, Addis Ababa"; a.type = "Warehouse"; a.capacity = 1000; a.currentItems = 847; a.status = "Active"; a.lastAudit = "2024-01-10"; a.manager = "Dawit Haile"; a.contact = "+251911234567";
        StorageLocation b = new StorageLocation();
        b.id = "2"; b.name = "Evidence Room Central"; b.address = "Federal Police HQ, Addis Ababa"; b.type = "Evidence Room"; b.capacity = 500; b.currentItems = 234; b.status = "Active"; b.lastAudit = "2024-01-12"; b.manager = "Sara Tekle"; b.contact = "+251911234568";
        StorageLocation c = new StorageLocation();
        c.id = "3"; c.name = "Secure Vault B"; c.address = "High Security Facility"; c.type = "Secure Vault"; c.capacity = 200; c.currentItems = 156; c.status = "Active"; c.lastAudit = "2024-01-08"; c.manager = "Yohannes Kebede"; c.contact = "+251911234569";
        locations.addAll(List.of(a,b,c));

        InventoryItem i1 = new InventoryItem(); i1.id = "1"; i1.contrabandCode = "CMS-001234"; i1.type = "Drugs"; i1.location = "Warehouse A"; i1.status = "Present"; i1.lastSeen = "2024-01-15T10:30:00"; i1.assignedDate = "2024-01-15";
        InventoryItem i2 = new InventoryItem(); i2.id = "2"; i2.contrabandCode = "CMS-001235"; i2.type = "Weapons"; i2.location = "Evidence Room Central"; i2.status = "Missing"; i2.lastSeen = "2024-01-10T14:20:00"; i2.assignedDate = "2024-01-10";
        items.addAll(List.of(i1,i2));

        AuditEvent e1 = new AuditEvent(); e1.id = "AUD-1"; e1.timestamp = "2024-01-15T12:00:00"; e1.actor = "Auditor Sara"; e1.action = "CHECK"; e1.notes = "Routine check";
        auditByLocation.put(a.id, List.of(e1));
    }

    @GetMapping("/inventory/locations")
    public List<StorageLocation> locations() { return locations; }

    @GetMapping("/inventory/items")
    public List<InventoryItem> items() { return items; }

    @GetMapping("/inventory/locations/{id}")
    public Map<String, Object> locationDetail(@PathVariable String id) {
        StorageLocation loc = locations.stream().filter(l -> l.id.equals(id)).findFirst().orElse(null);
        if (loc == null) return Map.of();
        Map<String, Object> res = new HashMap<>();
        res.put("location", loc);
        res.put("items", items.stream().filter(i -> i.location.equals(loc.name)).toList());
        res.put("audit", auditByLocation.getOrDefault(id, List.of()));
        return res;
    }
}