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
};

export function createRouteMapHtml({
                                       appKey,
                                       start,
                                       end,
                                       path,
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
          letter-spacing: -0.2px;
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

          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(startData.lat, startData.lng),
            level: 5,
          };

          const map = new kakao.maps.Map(container, options);
          const bounds = new kakao.maps.LatLngBounds();

          // 경로선
          const linePath = pathData.map((point) => {
            const latLng = new kakao.maps.LatLng(point.lat, point.lng);
            bounds.extend(latLng);
            return latLng;
          });

          // 흰색 바닥선
          const basePolyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 12,
            strokeColor: "#FFFFFF",
            strokeOpacity: 1,
            strokeStyle: "solid",
          });

          // 파란 메인선
          const mainPolyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 7,
            strokeColor: "#2563EB",
            strokeOpacity: 0.95,
            strokeStyle: "solid",
          });

          basePolyline.setMap(map);
          mainPolyline.setMap(map);

          const startPosition = new kakao.maps.LatLng(startData.lat, startData.lng);
          const endPosition = new kakao.maps.LatLng(endData.lat, endData.lng);

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
        })();
      </script>
    </body>
  </html>
  `;
}