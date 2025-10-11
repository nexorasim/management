package com.nexorasim.sdk;

public class Analytics {
    private int total;
    private int active;
    private int inactive;
    private String carrier;

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getActive() { return active; }
    public void setActive(int active) { this.active = active; }

    public int getInactive() { return inactive; }
    public void setInactive(int inactive) { this.inactive = inactive; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }
}