// 카카오맵을 WebView로 띄우기 위한 HTML 문자열을 생성하는 함수입니다.
type MapHtmlParams = {
    appKey: string;
    latitude: number;
    longitude: number;
    markerTitle?: string;
};

export function createKakaoMapHtml({
                                       appKey,
                                       latitude,
                                       longitude,
                                       markerTitle = "현재 위치",
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
          const lat = ${latitude};
          const lng = ${longitude};

          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
          };

          const map = new kakao.maps.Map(container, options);

          const markerPosition = new kakao.maps.LatLng(lat, lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: ${JSON.stringify(markerTitle)},
          });

          marker.setMap(map);

          window.addEventListener("message", function (event) {
            try {
              const data = JSON.parse(event.data);

              if (data.type === "UPDATE_LOCATION") {
                const nextLatLng = new kakao.maps.LatLng(data.latitude, data.longitude);
                map.setCenter(nextLatLng);
                marker.setPosition(nextLatLng);
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