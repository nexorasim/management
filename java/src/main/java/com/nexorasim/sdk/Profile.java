package com.nexorasim.sdk;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class Profile {
    private String id;
    private String iccid;
    private String eid;
    private String status;
    private String carrier;
    private String msisdn;
    private String imsi;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastActivatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIccid() { return iccid; }
    public void setIccid(String iccid) { this.iccid = iccid; }

    public String getEid() { return eid; }
    public void setEid(String eid) { this.eid = eid; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public String getMsisdn() { return msisdn; }
    public void setMsisdn(String msisdn) { this.msisdn = msisdn; }

    public String getImsi() { return imsi; }
    public void setImsi(String imsi) { this.imsi = imsi; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastActivatedAt() { return lastActivatedAt; }
    public void setLastActivatedAt(LocalDateTime lastActivatedAt) { this.lastActivatedAt = lastActivatedAt; }
}