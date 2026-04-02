type MapPoint = {
    lat: number;
    lng: number;
    name?: string;
};

type MapHtmlParams = {
    appKey: string;

    // 기존 현재 위치 마커용
    latitude?: number;
    longitude?: number;
    markerTitle?: string;

    // 경로 표시용
    start?: MapPoint;
    end?: MapPoint;
    path?: MapPoint[];
};

// 카카오맵을 WebView로 띄우기 위한 HTML 문자열 생성 함수
export function createKakaoMapHtml({
                                       appKey,
                                       latitude,
                                       longitude,
                                       markerTitle = "현재 위치",
                                       start,
                                       end,
                                       path = [],
                                   }: MapHtmlParams) {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      />
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>

      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}"></script>
      <script>
        (function () {
          const singleMarker = {
            latitude: ${latitude ?? "null"},
            longitude: ${longitude ?? "null"},
            markerTitle: ${JSON.stringify(markerTitle)},
          };

          const startData = ${JSON.stringify(start ?? null)};
          const endData = ${JSON.stringify(end ?? null)};
          const pathData = ${JSON.stringify(path ?? [])};

          const hasPath = Array.isArray(pathData) && pathData.length > 0;

          // 지도 중심 좌표 결정
          let centerLat = 37.5665;
          let centerLng = 126.9780;

          if (hasPath && startData) {
            centerLat = startData.lat;
            centerLng = startData.lng;
          } else if (
            singleMarker.latitude !== null &&
            singleMarker.longitude !== null
          ) {
            centerLat = singleMarker.latitude;
            centerLng = singleMarker.longitude;
          }

          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(centerLat, centerLng),
            level: 3,
          };

          const map = new kakao.maps.Map(container, options);

          let currentMarker = null;

          // 1. 경로 모드
          if (hasPath) {
            const bounds = new kakao.maps.LatLngBounds();

            const linePath = pathData.map((point) => {
              const latLng = new kakao.maps.LatLng(point.lat, point.lng);
              bounds.extend(latLng);
              return latLng;
            });

            const polyline = new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: "#2563EB",
              strokeOpacity: 0.9,
              strokeStyle: "solid",
            });

            polyline.setMap(map);

            if (startData) {
              const startPosition = new kakao.maps.LatLng(startData.lat, startData.lng);

              const startMarker = new kakao.maps.Marker({
                position: startPosition,
                title: startData.name || "출발지",
              });

              startMarker.setMap(map);

              const startInfo = new kakao.maps.InfoWindow({
                content: '<div style="padding:6px 10px;font-size:12px;">출발</div>',
              });

              startInfo.open(map, startMarker);
              bounds.extend(startPosition);
            }

            if (endData) {
              const endPosition = new kakao.maps.LatLng(endData.lat, endData.lng);

              const endMarker = new kakao.maps.Marker({
                position: endPosition,
                title: endData.name || "도착지",
              });

              endMarker.setMap(map);

              const endInfo = new kakao.maps.InfoWindow({
                content: '<div style="padding:6px 10px;font-size:12px;">도착</div>',
              });

              endInfo.open(map, endMarker);
              bounds.extend(endPosition);
            }

            map.setBounds(bounds);
          }

          // 2. 단일 마커 모드
          else if (
            singleMarker.latitude !== null &&
            singleMarker.longitude !== null
          ) {
            const markerPosition = new kakao.maps.LatLng(
              singleMarker.latitude,
              singleMarker.longitude
            );

            currentMarker = new kakao.maps.Marker({
              position: markerPosition,
              title: singleMarker.markerTitle,
            });

            currentMarker.setMap(map);
          }

          // 3. 현재 위치 갱신 메시지 처리
          // 경로 모드에서는 보통 안 쓰고, 단일 마커 모드에서만 주로 사용
          window.addEventListener("message", function (event) {
            try {
              const data = JSON.parse(event.data);

              if (
                data.type === "UPDATE_LOCATION" &&
                currentMarker &&
                typeof data.latitude === "number" &&
                typeof data.longitude === "number"
              ) {
                const nextLatLng = new kakao.maps.LatLng(
                  data.latitude,
                  data.longitude
                );

                map.setCenter(nextLatLng);
                currentMarker.setPosition(nextLatLng);
              }
            } catch (e) {
              console.error(e);
            }
          });
        })();
      </script>
    </body>
  </html>
  `;
}