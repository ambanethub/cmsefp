package com.cms.audit.model;

import java.util.Map;

public class AuditLog {
    public String id;
    public String timestamp;
    public String actor;
    public String actorRole;
    public String action;
    public String entityType;
    public String entityId;
    public String description;
    public String ipAddress;
    public String location;
    public String hash;
    public boolean verified;
    public boolean flagged;
    public Map<String, Object> metadata;
}