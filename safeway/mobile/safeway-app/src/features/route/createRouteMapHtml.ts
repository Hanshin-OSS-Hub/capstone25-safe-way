// 이 코드는 경로 결과 화면에서 Kakao Map WebView에 출발지, 도착지, 경로선, 현재 위치 마커를 렌더링하는 HTML 생성 코드입니다.
type RoutePoint = {
    lat: number;
    lng: number;
};

type RouteMapHtmlParams = {
    appKey: string;
    start: {
        lat: number;
        lng: number;
        name?: string;
    };
    end: {
        lat: number;
        lng: number;
        name?: string;
    };
    path: RoutePoint[];
    currentLocation?: RoutePoint;
};

// 경로 결과 지도에 사용할 Kakao Map HTML 문자열을 생성하는 함수입니다.
export function createRouteMapHtml({
    appKey,
    start,
    end,
    path,
    currentLocation,
}: RouteMapHtmlParams) {
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
          background: #ffffff;
        }

        .route-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-sizing: border-box;
        }

        .route-badge.start {
          background: #3b82f6;
        }

        .route-badge.end {
          background: #ef4444;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>

      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}"></script>
      <script>
        (function () {
          const startData = ${JSON.stringify(start)};
          const endData = ${JSON.stringify(end)};
          const pathData = ${JSON.stringify(path)};
          const currentLocationData = ${JSON.stringify(currentLocation ?? null)};

          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(startData.lat, startData.lng),
            level: 5,
          };

          const map = new kakao.maps.Map(container, options);
          const bounds = new kakao.maps.LatLngBounds();
          let currentLocationMarker = null;
          let baseRoutePolyline = null;
          let routePolyline = null;
          let isGuideStarted = false;
          let clearedPathIndex = 0;
          const routePassDistanceMeters = 25;

          // 현재 위치 마커가 없으면 최초 1회 생성하고, 있으면 위치만 갱신하는 함수입니다.
          function updateCurrentLocationMarker(latitude, longitude) {
            const nextLatLng = new kakao.maps.LatLng(latitude, longitude);

            if (currentLocationMarker) {
              currentLocationMarker.setPosition(nextLatLng);
              return;
            }

            currentLocationMarker = new kakao.maps.Marker({
              position: nextLatLng,
              title: "현재 위치",
            });
            currentLocationMarker.setMap(map);
          }

          // 현재 지도에 그려진 경로 폴리라인을 제거하고 참조를 초기화하는 함수입니다.
          function clearRoutePolyline() {
            if (baseRoutePolyline) {
              baseRoutePolyline.setMap(null);
              baseRoutePolyline = null;
            }

            if (routePolyline) {
              routePolyline.setMap(null);
              routePolyline = null;
            }
          }

          // 두 좌표 사이의 직선 거리를 미터 단위로 계산하는 함수입니다.
          function getDistanceMeters(from, to) {
            const earthRadiusMeters = 6371000;
            const fromLatitude = (from.lat * Math.PI) / 180;
            const toLatitude = (to.lat * Math.PI) / 180;
            const latitudeDelta = ((to.lat - from.lat) * Math.PI) / 180;
            const longitudeDelta = ((to.lng - from.lng) * Math.PI) / 180;
            const haversine =
              Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
              Math.cos(fromLatitude) *
                Math.cos(toLatitude) *
                Math.sin(longitudeDelta / 2) *
                Math.sin(longitudeDelta / 2);

            return (
              earthRadiusMeters *
              2 *
              Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
            );
          }

          // 현재 위치와 가장 가까운 경로 좌표 인덱스를 찾는 함수입니다.
          function findNearestPathIndex(latitude, longitude) {
            let nearestIndex = clearedPathIndex;
            let nearestDistance = Infinity;
            const currentPoint = {
              lat: latitude,
              lng: longitude,
            };

            for (let index = clearedPathIndex; index < pathData.length; index += 1) {
              const distance = getDistanceMeters(currentPoint, pathData[index]);

              if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
              }
            }

            return {
              index: nearestIndex,
              distance: nearestDistance,
            };
          }

          // 지나간 경로를 제외한 남은 경로만 폴리라인에 다시 반영하는 함수입니다.
          function updateRemainingRoutePolyline(latitude, longitude) {
            if (!isGuideStarted || !baseRoutePolyline || !routePolyline) {
              return;
            }

            const nearest = findNearestPathIndex(latitude, longitude);

            if (
              nearest.distance > routePassDistanceMeters ||
              nearest.index <= clearedPathIndex
            ) {
              return;
            }

            clearedPathIndex = nearest.index;

            const currentLatLng = new kakao.maps.LatLng(latitude, longitude);
            const remainingLinePath = pathData
              .slice(clearedPathIndex + 1)
              .map((point) => new kakao.maps.LatLng(point.lat, point.lng));
            const nextLinePath = [currentLatLng].concat(remainingLinePath);

            if (nextLinePath.length < 2) {
              clearRoutePolyline();
              return;
            }

            baseRoutePolyline.setPath(nextLinePath);
            routePolyline.setPath(nextLinePath);
          }

          // React Native WebView에서 보낸 현재 위치 메시지를 처리하는 함수입니다.
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
                updateCurrentLocationMarker(data.latitude, data.longitude);
                updateRemainingRoutePolyline(data.latitude, data.longitude);
              }

              if (data && data.type === "START_GUIDE") {
                isGuideStarted = true;
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

          const linePath = pathData.map((point) => {
            const latLng = new kakao.maps.LatLng(point.lat, point.lng);
            bounds.extend(latLng);
            return latLng;
          });

          baseRoutePolyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 12,
            strokeColor: "#FFFFFF",
            strokeOpacity: 1,
            strokeStyle: "solid",
          });

          routePolyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 7,
            strokeColor: "#2563EB",
            strokeOpacity: 0.95,
            strokeStyle: "solid",
          });

          baseRoutePolyline.setMap(map);
          routePolyline.setMap(map);

          const startPosition = new kakao.maps.LatLng(startData.lat, startData.lng);
          const endPosition = new kakao.maps.LatLng(endData.lat, endData.lng);

          // 출발지와 도착지 표시용 커스텀 오버레이를 생성하는 함수입니다.
          function createBadgeOverlay(position, type, label) {
            const content = document.createElement("div");
            content.className = "route-badge " + type;
            content.textContent = label;

            return new kakao.maps.CustomOverlay({
              position,
              content,
              yAnchor: 1.15,
              zIndex: 10,
            });
          }

          const startOverlay = createBadgeOverlay(startPosition, "start", "출발");
          const endOverlay = createBadgeOverlay(endPosition, "end", "도착");

          startOverlay.setMap(map);
          endOverlay.setMap(map);

          bounds.extend(startPosition);
          bounds.extend(endPosition);

          map.setBounds(bounds);

          if (currentLocationData) {
            updateCurrentLocationMarker(
              currentLocationData.lat,
              currentLocationData.lng
            );
          }

          document.addEventListener("message", handleCurrentLocationMessage);
          window.addEventListener("message", handleCurrentLocationMessage);
        })();
      </script>
    </body>
  </html>
  `;
}
