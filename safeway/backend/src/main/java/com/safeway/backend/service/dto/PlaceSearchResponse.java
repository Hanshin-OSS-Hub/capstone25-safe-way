package com.safeway.backend.service.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PlaceSearchResponse {
    private String placeName;
    private String addressName;
    private String roadAddressName;
    private String lat; // 위도
    private String lon; // 경도
    private String categoryName;
}