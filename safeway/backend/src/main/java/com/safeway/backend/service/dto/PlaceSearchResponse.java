package com.safeway.backend.service.dto;

import lombok.Builder;
import lombok.Getter;

// DTO가 이렇게 되어 있는지 확인하세요!
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