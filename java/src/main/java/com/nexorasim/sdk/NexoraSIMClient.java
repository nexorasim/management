package com.nexorasim.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class NexoraSIMClient {
    private final String baseUrl;
    private final String apiKey;
    private final CloseableHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public NexoraSIMClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.httpClient = HttpClients.createDefault();
        this.objectMapper = new ObjectMapper();
    }

    public ProfileResponse getProfiles(String carrier) throws IOException {
        String url = baseUrl + "/profiles" + (carrier != null ? "?carrier=" + carrier : "");
        HttpGet request = new HttpGet(url);
        request.setHeader("Authorization", "Bearer " + apiKey);
        
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, ProfileResponse.class);
        }
    }

    public Profile activateProfile(String profileId) throws IOException {
        String url = baseUrl + "/profiles/" + profileId + "/activate";
        HttpPut request = new HttpPut(url);
        request.setHeader("Authorization", "Bearer " + apiKey);
        
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, Profile.class);
        }
    }

    public Profile deactivateProfile(String profileId) throws IOException {
        String url = baseUrl + "/profiles/" + profileId + "/deactivate";
        HttpPut request = new HttpPut(url);
        request.setHeader("Authorization", "Bearer " + apiKey);
        
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, Profile.class);
        }
    }

    public Analytics getAnalytics(String carrier) throws IOException {
        String url = baseUrl + "/profiles/analytics" + (carrier != null ? "?carrier=" + carrier : "");
        HttpGet request = new HttpGet(url);
        request.setHeader("Authorization", "Bearer " + apiKey);
        
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, Analytics.class);
        }
    }

    public void close() throws IOException {
        httpClient.close();
    }
}