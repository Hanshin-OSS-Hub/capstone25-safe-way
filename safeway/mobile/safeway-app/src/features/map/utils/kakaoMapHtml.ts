// 이 코드는 Kakao Map JavaScript API를 WebView에서 렌더링하고 React Native 위치 메시지로 현재 위치 마커를 갱신하는 HTML 생성 코드입니다.
type MapPoint = {
    lat: number;
    lng: number;
    name?: string;
};

type MapHtmlParams = {
    appKey: string;
    latitude?: number;
    longitude?: number;
    markerTitle?: string;
    start?: MapPoint;
    end?: MapPoint;
    path?: MapPoint[];
};

// 카카오맵을 WebView로 띄우기 위한 HTML 문자열을 생성하는 함수입니다.
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
          let currentLocationMarker = null;
          let routePolyline = null;

          // 현재 위치 마커가 없으면 최초 1회 생성하고, 있으면 위치만 갱신하는 함수입니다.
          function updateCurrentLocationMarker(latitude, longitude) {
            const nextLatLng = new kakao.maps.LatLng(latitude, longitude);

            if (currentLocationMarker) {
              currentLocationMarker.setPosition(nextLatLng);
              return;
            }

            currentLocationMarker = new kakao.maps.Marker({
              position: nextLatLng,
              title: singleMarker.markerTitle,
            });
            currentLocationMarker.setMap(map);
          }

          // 현재 지도에 그려진 경로 폴리라인을 제거하고 참조를 초기화하는 함수입니다.
          function clearRoutePolyline() {
            if (!routePolyline) {
              return;
            }

            routePolyline.setMap(null);
            routePolyline = null;
          }

          // React Native WebView에서 보낸 현재 위치 변경 메시지를 처리하는 함수입니다.
          function handleCurrentLocationMessage(event) {
            try {
              const data =
                typeof event.data === "string" ? JSON.parse(event.data) : event.data;

              if (
                data &&
                data.type === "UPDATE_CURRENT_LOCATION" &&
                typeof data.latitude === "number" &&
                typeof data.longitude === "number"
              ) {
                if (data.clearPolyline === true) {
                  clearRoutePolyline();
                }

                updateCurrentLocationMarker(data.latitude, data.longitude);
              }

              if (
                data &&
                data.type === "CENTER_ON_CURRENT_LOCATION" &&
                typeof data.latitude === "number" &&
                typeof data.longitude === "number"
              ) {
                const currentLatLng = new kakao.maps.LatLng(
                  data.latitude,
                  data.longitude
                );

                updateCurrentLocationMarker(data.latitude, data.longitude);
                map.setCenter(currentLatLng);
              }
            } catch (e) {
              console.error(e);
            }
          }

          if (hasPath) {
            const bounds = new kakao.maps.LatLngBounds();

            const linePath = pathData.map((point) => {
              const latLng = new kakao.maps.LatLng(point.lat, point.lng);
              bounds.extend(latLng);
              return latLng;
            });

            routePolyline = new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: "#2563EB",
              strokeOpacity: 0.9,
              strokeStyle: "solid",
            });

            routePolyline.setMap(map);

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
          } else if (
            singleMarker.latitude !== null &&
            singleMarker.longitude !== null
          ) {
            updateCurrentLocationMarker(singleMarker.latitude, singleMarker.longitude);
          }

          document.addEventListener("message", handleCurrentLocationMessage);
          window.addEventListener("message", handleCurrentLocationMessage);
        })();
      </script>
    </body>
  </html>
  `;
}
