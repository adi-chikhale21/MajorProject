            maptilersdk.config.apiKey = mapToken;
            const map = new maptilersdk.Map({
              container: 'map', // container's id or the HTML element to render the map
              style: "streets-v2",
              center: listing.coordinates, // starting position [lng, lat]
              zoom: 9, // starting zoom
            });

            
            // const marker = new maptilersdk.Marker({
            //     color: '#FF0000',
            //     icon: '<i class="fa-regular fa-compass"></i>' // Set marker color (red)
            //     // You can also customize the marker icon further, for example:
            //     //  // Set custom icon image
            // })
            // .setLngLat(listing.coordinates)
            // .setPopup(new maptilersdk.Popup({offset: 25})
            // .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
            // .addTo(map);
            
            map.on('load', function () {
                map.loadImage(
                  'https://upload.wikimedia.org/wikipedia/commons/b/b6/Home_icon_red-1.png',
                  function (error, image) {
                    if (error) throw error;
                    map.addImage('cat', image);
                    map.addSource('point', {
                      'type': 'geojson',
                      'data': {
                        'type': 'FeatureCollection',
                        'features': [
                          {
                            'type': 'Feature',
                            'geometry': {
                              'type': 'Point',
                              'coordinates': listing.coordinates
                            }
                          }
                        ]
                      }
                    });
                    map.addLayer({
                      'id': 'points',
                      'type': 'symbol',
                      'source': 'point',
                      'layout': {
                        'icon-image': 'cat',
                        'icon-size': 0.090
                      }
                    });
                }
              );
              var popup = new maptilersdk.Popup({
                closeButton: true, // Disable the close button
                closeOnClick: false // Don't close the popup when the map is clicked
              });
        
              // Add popup to the marker
              map.on('click', 'points', function (e) {
                popup.setLngLat(listing.coordinates)
                  .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`) // Set the HTML content of the popup
                  .addTo(map);
              });
        
              // Change the cursor to a pointer when the mouse is over the marker
              map.on('mouseenter', 'points', function () {
                map.getCanvas().style.cursor = 'pointer';
              });
        
              // Change it back to the default cursor when it leaves
              map.on('mouseleave', 'points', function () {
                map.getCanvas().style.cursor = '';
              });
            })

            // map.on('load', function () {
            //     // Create a custom marker image from the Font Awesome icon
            //     const markerIcon = {
            //         url: 'C:\Users\omsai\Desktop\Major Project\airbnb-icon-512x512-d9grja5t.png', // Replace 'path/to/custom-marker.svg' with the path to your SVG file
            //         width: 60, // Adjust the width of the marker icon
            //         height: 60 // Adjust the height of the marker icon
            //     };
            
            //     // Add marker to map using the custom marker image
            //     new maptilersdk.Marker({
            //         element: markerIcon.url, // URL of the custom marker image
            //         anchor: 'bottom' // Adjust the anchor point if needed
            //     })
            //     .setLngLat(listing.coordinates) // Marker coordinates
            //     .addTo(map);
            // });
            
            