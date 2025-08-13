package com.cms.auth.model;

public class UserResponse {
    private String username;
    private String role;
    private String name;
    private boolean authenticated;
    private String token;

    public UserResponse() {}

    public UserResponse(String username, String role, String name, boolean authenticated, String token) {
        this.username = username;
        this.role = role;
        this.name = name;
        this.authenticated = authenticated;
        this.token = token;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}